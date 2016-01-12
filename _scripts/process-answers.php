<?php

// wget https://docs.google.com/spreadsheets/d/1Eug2zk0hahgbkAwrMVnXoAs4Cfxs8hABZEJuLFRgPMM/pub?output=csv -O resource/teste.csv

define(
    'URL_GOOGLE_ANSWERS_CSV',
    'https://docs.google.com/spreadsheets/d/1Eug2zk0hahgbkAwrMVnXoAs4Cfxs8hABZEJuLFRgPMM/pub?output=csv'
);

/********************************| FUNCTIONS |*********************************/

function dbg($param, $exit = true) {

    echo (!isset($_SERVER['argv']))
        ? '<pre>'
        : "\n";

    print_r($param);

    if (isset($_SERVER['argv'])) {
        echo "\n\n";
    }

    if ($exit) {
        exit;
    }

    if (!isset($_SERVER['argv'])) {
        echo '</pre>';
    }
}

function isAAnswer($line) {
    $date = strtok($line, ',');

    $format = 'd/m/Y H:i:s';

    $d = DateTime::createFromFormat($format, $date);
    return ($d && $d->format($format) == $date);
}

function getCsvFormContent() {
    return file(URL_GOOGLE_ANSWERS_CSV);
}

function addCommaMarkup($string) {
    return str_replace(',', '|MARK_VIRGULA|', $string);
}

function removeCommaMarkup($string) {
    return str_replace('|MARK_VIRGULA|', ',', $string);
}

function addNewLineMarkup($string) {
    return str_replace("\n", '|NLB|', $string);
}

function removeNewLineMarkup($string) {
    return str_replace('|NLB|', "\n", $string);
}

function processUsername($username) {
    $username = ucwords(strtolower(trim($username)));

    return str_replace(
        array(' Dos ', ' De ', ' Da '),
        array(' dos ', ' de ', ' da '),
        $username
    );
}

function processEmail($email) {

    $email = trim($email);

    if (
        !strlen($email)
        || !strstr($email, '@')
    ) {
        return '';
    }

    // remove blank spaces
    $email = str_replace(
        ' ',
        '',
        strtolower($email)
    );

    // 123

    // correct email domains
    $email = str_replace(
        array('@lide. com', '@gmai.com',  '@gmal.com',  '@gmail',     '@hotmail'),
        array('@live.com',  '@gmail.com', '@gmail.com', '@gmail.com', '@hotmail.com'),
        $email
    );

    return str_replace(
        array('@gmail.com.com', '@hotmail.com.com', '@gmail.comcomx'),
        array('@gmail.com',     '@hotmail.com',     '@gmail.com'),
        $email
    );
}

function correctCsvSplit($line) {

    // clean white spaces
    $line = str_replace("\n", '|NLB|', trim($line));
    $line = str_replace('""', '\'', $line);

    // MÉTODO 1
    preg_match('/\"(.*)\"/', $line, $matches);
    if (!empty($matches)) {

        $pattern = strtok($matches['0'], '"');

        $line = str_replace(
            '"' . $pattern . '"',
            addCommaMarkup($pattern),
            $line
        );

        $pattern = strstr($line, '"');

        $pattern2 = substr(
            addCommaMarkup($pattern),
            1,
            -1
        );

        $line = str_replace(
            $pattern,
            $pattern2,
            $line
        );

    // MÉTODO 2
    } else {

        $pattern = strstr($line, '"');

        // verifica se ficou alguma vírgula no final
        if (substr($pattern, strlen($pattern)-1) == ',') {
            $pattern = substr($pattern, 0, strlen($pattern)-1);
        }

        $finalString = addCommaMarkup($pattern);
        $finalString = substr($finalString, 1, (strlen($finalString) - 2));

        $line = str_replace(
            $pattern,
            $finalString,
            $line
        );
    }

    return $line;
}

function isATestAnswer($line) {
    $isATestAnswer = false;

    if (isAAnswer($line)) {
        $answers = explode(',', correctCsvSplit($line));

        if (
            isset($answers['1'])
            && strstr(strtolower($answers['1']), 'teste')
        ) {
            $isATestAnswer = true;
        }
    }

    return $isATestAnswer;
}

function getFinalAnswers($csvFormContent) {
    $correctLines  = array();
    $repeatedLines = array();
    $testLines     = array();
    $lastLine      = '';

    // read csv file
    // $lines = file(APP_PATH . 'resource' . DIRECTORY_SEPARATOR . 'teste.csv');

    // disregarding line break on csv file
    foreach ($csvFormContent as $key => $line) {

        // disregarding header from spreadsheet
        if ($key > 0) {

            $currentLine = str_replace(strtok($line, ',') . ',', '', $line);

            // disregarding repeated answers
            if ($lastLine != $currentLine) {

                // disregarding test answers
                if (!isATestAnswer($line)) {
                    
                    // update the last line
                    $lastLine = $currentLine;

                    // default replaces
                    $line = str_replace('"Acompanhante (parente, amigo, marido etc.)"', 'Acompanhante', $line);
                    $line = str_replace('"Depois de esperar por um tempo, consegui um leito"', 'Depois de esperar por um tempo|MARK_VIRGULA| consegui um leito', $line);

                    if (isAAnswer($line)) {
                        $correctLines[] = $line;
                    } else {
                        $lastIndex = count($correctLines)-1;
                        $correctLines[$lastIndex] .= $line;
                    }
                }

                // log test answers
                else {
                    $testLines[] = $line;
                }
            }

            // log repeated answers
            else {
                $repeatedLines[] = $line;
            }
        }
    }

    $finalAnswers = array();
    foreach ($correctLines as $key => $line) {
        
        $line = correctCsvSplit($line);

        // proccess answer informations
        $fields = explode(',', $line);

        // name
        $fields['1'] = processUsername($fields['1']);

        // email
        $fields['2'] = processEmail($fields['2']);

        // problemas para conseguir leito
        $fields['8'] = removeCommaMarkup($fields['8']);

        $fields['14'] = removeCommaMarkup(
            removeNewLineMarkup(
                str_replace('  ', ' ', $fields['14'])
            )
        );
        
        $fields['15'] = removeCommaMarkup(
            removeNewLineMarkup(
                str_replace('  ', ' ', $fields['15'])
            )
        );

        if ($fields['0'] == '27/11/2015 10:31:28') {
            $fields['15'] = 'Meu primeiro filho nasceu na Unimed (hoje ele tem 9 anos, então, já faz algum tempo). Dessa experiência, não tenho tantas lembranças boas. Na época, tudo muito desorganizado e a enfermaria contava com 12 leitos e um único banheiro. 12 leitos para 12 mulheres paridas + suas 12 acompanhantes é super complicado! O centro cirúrgico até sujo estava e super bagunçado, cheio de coisas empilhadas. Outra coisa que considero péssima e aconteceu comigo lá: eu tive cesárea e, claro, o leite não veio de imediato em grande quantidade (na época eu não sabia que isso era o normal, mas as pessoas no hospital deveriam saber). Prontamente trouxeram Nan pro meu filho e a pediatra do plantão orientou a dar o Nan como complemento. Resultado disso: meu filho já saiu de lá tomando Nan, eu não fui orientada sobre a maneira correta de colocar o peito na boca da criança e, em apenas um mês, ele não mamava mais peito, apenas Nan. Isso foi muito ruim pra saúde dele no decorrer do tempo.';
        }

        if ($fields['0'] == '27/11/2015 10:33:24') {
            $fields['3'] = 'Hospital Santa Júlia';
            $fields['15'] = 'tive minha filha caçula no Santa Júlia (ela tem 3 anos, então é uma experiência mais recente). Lá fui muito bem recebida desde o momento da internação, tudo muito organizado. A enfermaria super humanizada, contando com apenas 2 leitos para 1 banheiro e, além da minha acompanhante, meu esposo pôde ficar muito mais tempo do que o tempo permitido para visitas (tanto ele quanto o esposo da outra moça que teve bebê no mesmo dia que eu puderam ficar). Centro cirúrgico limpo e organizado. E sobre a amamentação: eu recebi logo que fui pra enfermaria a visita da pediatra de plantão que, antes que eu falasse qualquer coisa, já veio dando as orientações de como colocar o seio na boca da criança, dizendo que no início o leite sai pouco mesmo e que nem pensar em dar qualquer complemento, que era pra eu ficar firme que o leite ia sair em maior volume com o tempo. Exatamente o oposto do que aconteceu na Unimed. Resultado disso: eu amamentei da forma correta, o leite foi saindo em maior volume com o tempo mesmo e minha filha mamou exclusivamente leite do peito até 6 meses de idade e, depois disso, introduzi os alimentos, água e sucos, mas ela ainda mamou até 2 anos e 3 meses. Pode parecer besteira, mas aquela orientação correta e aquele encorajamento que recebi ali da pediatra do plantão no dia em que ela nasceu fizeram toda a diferença.';
        }

        if ($fields['0'] == '28/11/2015 12:14:32') {
            $fields['1'] = 'Ávila Goes';
            $fields['3'] = 'Maternidade Azilda da Silva Marreiro';
        }

        if ($fields['0'] == '28/11/2015 16:28:25') {
            $fields['1'] = 'Liliane Almeida';
        }

        if ($fields['0'] == '23/09/2015 14:43:16') {
            $fields['1'] = 'Hanny Maysa';
        }

        if ($fields['0'] == '29/11/2015 09:24:47') {
            $fields['1'] = 'Joyce Santos';
        }

        if ($fields['0'] == '31/08/2015 10:37:22') {
            $fields['3'] = 'Hospital Santa Júlia';
        }

        /**
         * TODO: verificar porque a "Francine dos Santos fernandes" não
         * foi detectada como repetida
         */

        $finalAnswers[] = implode('||SEP||', $fields);
    }

    return $finalAnswers;
}

function normalizeIndex8($data) {

    // $data == 'não consegui leito e tive que ir a outra maternidade'
    $normalizedIndex = 'Péssimo';

    if ($data == 'Depois de esperar por um tempo, consegui um leito') {
        $normalizedIndex = 'Bom';
    } else if ($data == 'Não tive nenhum problema para conseguir leito') {
        $normalizedIndex = 'Excelente';
    }

    return $normalizedIndex;
}

function normalizeIndex12($data) {

    // $data == 'Mais de 2 horas'
    $normalizedIndex = 'Péssimo';

    if ($data == '2 horas') {
        $normalizedIndex = 'Ruim';
    } else if ($data == '1 hora') {
        $normalizedIndex = 'Bom';
    } else if ($data == '30 minutos') {
        $normalizedIndex = 'Ótimo';
    } else if ($data == '15 minutos') {
        $normalizedIndex = 'Excelente';
    }

    return $normalizedIndex;
}

function normalizeIndex13($data) {
    
    // $data == 'mais de 3 horas'
    $normalizedIndex = 'Péssimo';

    if ($data == '3 horas') {
        $normalizedIndex = 'Ruim';
    } else if ($data == '2 hora') {
        $normalizedIndex = 'Bom';
    } else if ($data == '1 hora') {
        $normalizedIndex = 'Ótimo';
    } else if ($data == '30 minutos') {
        $normalizedIndex = 'Excelente';
    }

    return $normalizedIndex;
}

function getAvailableAnswers() {
    return array(
        'Péssimo'   => -3,
        'Ruim'      => -2,
        'Bom'       =>  1,
        'Ótimo'     =>  2,
        'Excelente' =>  3
    );
}

function isRecentAnswer($year) {
    return (mktime(0, 0, 0, 0, 0, $year) >= mktime(0, 0, 0, 0, 0, date('Y')-3))
        ? true
        : false;
}

function isPregnant($data) {
    return ($data == 'Gestante')
        ? true
        : false;
}

function hasSuggestionImprovement($data) {
    $data = trim($data);

    return (strlen($data) >= 40)
        ? true
        : false;
}

function hasStory($data) {
    $data = trim($data);

    return (strlen($data) >= 80)
        ? true
        : false;
}

function getMaternitiesInfo($finalAnswers) {
    $availableAnswers = getAvailableAnswers();
    $maternities      = array();
    $invalid          = array();

    foreach ($finalAnswers as $key => $answer) {
        $info = explode('||SEP||', $answer);

        // unconsider unkknown matermities
        if (strlen(trim($info['3']))) {
            if (!array_key_exists($info['3'], $maternities)) {
                $maternities[$info['3']] = array(
                    'qtyAnswers' => 1,
                    'pregnant'   => 0,
                    'weight'     => 0,
                    'recent'     => 0,
                    'values'     => array(
                        'Péssimo'   => 0,
                        'Ruim'      => 0,
                        'Bom'       => 0,
                        'Ótimo'     => 0,
                        'Excelente' => 0,
                    )
                );
            } else {
                $maternities[$info['3']]['qtyAnswers']++;
            }

            $info['8']  = normalizeIndex8($info['8']);
            $info['12'] = normalizeIndex12($info['12']);
            $info['13'] = normalizeIndex13($info['13']);

            // checks if appraiser is a pregnant
            if (isPregnant($info['4'])) {
                $maternities[$info['3']]['pregnant']++;
                $maternities[$info['3']]['weight']++;
            }

            // checks if answer is recent
            if (isRecentAnswer($info['6'])) {
                $maternities[$info['3']]['recent']++;
                $maternities[$info['3']]['weight']++;
            }

            // // checks if exists suggestions
            // if (hasSuggestionImprovement($info['14'])) {
            //     $maternities[$info['3']]['weight']++;
            // }

            // // checks if exists story
            // if (hasStory($info['15'])) {
            //     $maternities[$info['3']]['weight']++;
            // }

            $mapValues = array(
                'Péssimo' => 0,
                'Ruim' => 0,
                'Bom' => 0,
                'Ótimo' => 0,
                'Excelente' => 0,
            );

            foreach ($info as $keyInfo => $valueInfo) {
                if (array_key_exists($valueInfo, $availableAnswers)) {
                    $maternities[$info['3']]['values'][$valueInfo]++;
                    $mapValues[$valueInfo]++;
                    // break;
                }
            }

            // apply the weights
            $negativeConcept = $mapValues['Ruim'] + $mapValues['Péssimo'];
            $positiveConcept = $mapValues['Ótimo'] + $mapValues['Excelente'];
            if ($negativeConcept > $positiveConcept) {
                $maternities[$info['3']]['weight']--;
            } else {
                $maternities[$info['3']]['weight']++;
            }
        }
    }

    // dbg($maternities);

    return $maternities;
}

function getRanking($finalAnswers) {
    $maternities = getMaternitiesInfo($finalAnswers);
    $sortKeys    = array();
    $ranking     = array();
    $count       = 0;
    foreach ($maternities as $key => $maternitie) {
        $values = $maternitie['values'];
        $total  = array_sum($values);

        $maternities[$key]['name'] = $key;

        $maternities[$key]['rank'] = ($values['Péssimo'] * -3)
            + ($values['Ruim'] * -2)
            + $values['Bom']
            + ($values['Ótimo'] * 2)
            + ($values['Excelente'] * 3)
            + $maternities[$key]['weight'];

        // if (($values['Ruim'] + $values['Péssimo']) > ($values['Ótimo'] + $values['Excelente'])) {
        //     $maternities[$key]['rank'] -= $maternitie['weight'];
        // } else {
        //     $maternities[$key]['rank'] += $maternitie['weight'];
        // }

        $sortKeys[$key] = $maternities[$key]['rank'];
    }

    // sort group in decreasing order
    array_multisort($sortKeys, SORT_DESC, $maternities);

    return $maternities;
}

function getAnswerLabels($csvFormContent) {
    $answerLabels = explode(',', correctCsvSplit($csvFormContent['0']));

    unset($answerLabels['0']);
    unset($answerLabels['1']);
    unset($answerLabels['2']);
    unset($answerLabels['3']);
    unset($answerLabels['6']);
    unset($answerLabels['14']);
    unset($answerLabels['15']);

    $answerLabels = array_values($answerLabels);

    foreach ($answerLabels as $key => $value) {
        $answerLabels[$key] = removeCommaMarkup($value);
    }

    return $answerLabels;
}

function writeJsonResult($ranking, $finalAnswers, $answerLabels) {

    $countRanking = 0;

    $obj = new stdClass;

    $obj->total_reviews = 0;
    foreach ($ranking as $v) {
        $obj->total_reviews += $v['qtyAnswers'];
    }

    $obj->last_update = new stdClass;
    $obj->last_update->date = date('d/m/Y');
    $obj->last_update->hour = date('H:i');

    $obj->top_ranking = array();
    foreach ($ranking as $value) {

        if ($countRanking <= 2) {
            $rank = new stdClass;
            $rank->name    = $value['name'];
            $rank->reviews = $value['qtyAnswers'];

            $rank->charts = array();
            
            // concepts
            $conceptChart = new stdClass;
            $conceptChart->title = 'Conceitos';
            $conceptChart->data = new stdClass;
            $conceptChart->data->Positivo = $value['values']['Ótimo'] + $value['values']['Excelente'];
            $conceptChart->data->Bom      = $value['values']['Bom'];
            $conceptChart->data->Negativo = $value['values']['Ruim'] + $value['values']['Péssimo'];
            $rank->charts[] = $conceptChart;

            // stage of labor
            $stageLabor = new stdClass;
            $stageLabor->title = 'Período do Parto';
            $stageLabor->data = new stdClass;
            $stageLabor->data->Recentes = $value['recent'];
            $stageLabor->data->Antigos  = $value['qtyAnswers'] - $value['recent'];
            $rank->charts[] = $stageLabor;

            // pregnant reviews
            $pregnantReviews = new stdClass;
            $pregnantReviews->title = 'Avaliações de Gestantes';
            $pregnantReviews->data = new stdClass;
            $pregnantReviews->data->Gestantes = $value['pregnant'];
            $pregnantReviews->data->Acompanhantes = $value['qtyAnswers'] - $value['pregnant'];
            $rank->charts[] = $pregnantReviews;

            $obj->top_ranking[] = $rank;
            $countRanking++;
        } else {
            break;
        }
    }

    $obj->general_ranking = array();
    foreach ($ranking as $value) {
        if (!strstr($value['name'], 'Outro__')) {
            $obj->general_ranking[] = array(
                'name'     => $value['name'],
                'reviews'  => $value['qtyAnswers'],
                'rank'     => $value['rank'],
                'pregnant' => $value['pregnant'],
                'recent'   => $value['recent'],
                'values'   => $value['values']
            );
        }
    }

    $generalData = array(
        '4' => array(
            'title' => 'Tipos de Avaliadores',
            'data' => array(
                'Acompanhante' => 0,
                'Gestante' => 0
            )
        ),
        '5' => array(
            'title' => 'Tipos de Parto',
            'data' => array(
                'Normal' => 0,
                'Cesárea' => 0
            )
        ),
        '7' => array(
            'title' => 'Estrutura do Prédio',
            'data' => array(
                'Péssimo' => 0,
                'Ruim' => 0,
                'Bom' => 0,
                'Ótimo' => 0,
                'Excelente' => 0
            )
        ),
        '8' => array(
            'title' => 'Disponibilidade de Leitos',
            'data' => array(
                'Não consegui leito e tive que ir a outra maternidade' => 0,
                'Depois de esperar por um tempo, consegui um leito' => 0,
                'Não tive nenhum problema para conseguir leito' => 0
            )
        ),
        '9' => array(
            'title' => 'Higiene dos Leitos e Banheiros',
            'data' => array(
                'Péssimo' => 0,
                'Ruim' => 0,
                'Bom' => 0,
                'Ótimo' => 0,
                'Excelente' => 0
            )
        ),
        '10' => array(
            'title' => 'Atendimento do médico obstetra',
            'data' => array(
                'Péssimo' => 0,
                'Ruim' => 0,
                'Bom' => 0,
                'Ótimo' => 0,
                'Excelente' => 0
            )
        ),
        '11' => array(
            'title' => 'Atendimento da Equipe Multidisciplinar',
            'data' => array(
                'Péssimo' => 0,
                'Ruim' => 0,
                'Bom' => 0,
                'Ótimo' => 0,
                'Excelente' => 0
            )
        ),
        '12' => array(
            'title' => 'Tempo de Espera Para Receber Atendimento na Chegada à Maternidade',
            'data' => array(
                '15 minutos' => 0,
                '30 minutos' => 0,
                '1 hora' => 0,
                '2 horas' => 0,
                'Mais de 2 horas' => 0
            )
        ),
        '13' => array(
            'title' => 'Tempo de Espera Para a 1ª Amamentação do Recém-Nascido',
            'data' => array(
                '30 minutos' => 0,
                '1 hora' => 0,
                '2 horas' => 0,
                '3 horas' => 0,
                'Mais de 3 horas' => 0
            )
        )
    );
    foreach($finalAnswers as $answer) {
        $info = explode('||SEP||', $answer);

        foreach ($generalData as $key => $value) {
            $information = ucfirst(
                str_replace('Cesária', 'Cesárea', $info[$key])
            );

            $generalData[$key]['data'][$information]++;
        }
    }

    $obj->other_statistics = array_values($generalData);

    fwrite(
        fopen(realpath(__DIR__ . '/../') . '/_data/results.json', 'w+'),
        str_replace("\/", '/', json_encode($obj, JSON_PRETTY_PRINT))
    );
}

$csvFormContent = getCsvFormContent();

$finalAnswers = getFinalAnswers($csvFormContent);

$answerLabels = getAnswerLabels($csvFormContent);

$ranking = getRanking($finalAnswers);

writeJsonResult($ranking, $finalAnswers, $answerLabels);