const path = require('path');
const fs = require('fs');

const referencesPath = path.join(__dirname, '../data/isg_references.json');
const references = JSON.parse(fs.readFileSync(referencesPath, 'utf8'));

const MESSAGES = {
    "RISCO BAIXO": {
        "score_level": 1,
        "message": "Olá, tudo bem?\nSeu acompanhamento de saúde está em dia e seus indicadores estão muito bons! Parabéns pelo cuidado com seu bem-estar. Seu ISG é {isg_score_level}.\nNos vemos novamente no próximo periódico em um ano. Continue mantendo seus hábitos saudáveis.\nConte com a gente no que precisar!"
    },
    "RISCO MÉDIO": {
        "score_level": 2,
        "message": "Olá, tudo bem?\nDurante seu acompanhamento de saúde, identificamos alguns pontos que precisam de atenção. Seu ISG é {isg_score_level}. Já traçamos juntos um plano de cuidado e agora é hora de colocar em prática!\nSiga as orientações combinadas e, se tiver dúvidas ou dificuldades, estamos aqui para ajudar.\nDaqui a 6 meses você deverá agendar nova avaliação no ambulatório com repetição de exames e consulta de acompanhamento.\nCuidar da sua saúde é um passo importante — e você não está sozinho nessa!"
    },
    "RISCO ALTO": {
        "score_level": 3,
        "message": "Olá, tudo bem?\nNa sua última avaliação, identificamos indicadores de risco que exigem atenção e acompanhamento mais próximo. Seu ISG foi {isg_score_level}, e precisamos corrigir esta rota.\nÉ muito importante seguir o plano de cuidado que foi proposto e agendar uma nova consulta em até 90 dias no ambulatório para reavaliarmos sua saúde e, se necessário, ajustar a condução.\nEstamos aqui para caminhar com você nessa jornada e ajudar no que for preciso. Cuidar da sua saúde é prioridade — conte conosco!"
    }
};

const calculateIsgScore = (healthRecord) => {
    let totalScore = 0;
    const gender = (healthRecord.gender || '').toLowerCase();

    for (const indicator in references) {
        if (!references.hasOwnProperty(indicator)) continue;

        const value = healthRecord[indicator];
        if (value === undefined || value === null || value === '') {
            continue; // Ignora indicadores sem valor
        }

        const refData = references[indicator];

        switch (indicator) {
            case "Doenças Crônicas Pré-existentes":
            case "Atividade Física":
            case "Tabagista":
                for (const r of refData.ranges) {
                    if (value === r.value) {
                        totalScore += r.score;
                        break;
                    }
                }
                break;
            case "Pressão Arterial":
                const sistolica = healthRecord['Pressão Arterial Sistólica'];
                const diastolica = healthRecord['Pressão Arterial Diastólica'];
                if (sistolica !== undefined && diastolica !== undefined) {
                    let category = "";
                    if (sistolica < 120 && diastolica < 80) {
                        category = "NORMAL";
                    } else if ((sistolica >= 120 && sistolica <= 139) || (diastolica >= 80 && diastolica <= 89)) {
                        category = "PRÉ-HIPERTENSÃO";
                    } else if (sistolica >= 140 || diastolica >= 90) {
                        category = "HIPERTENSAO";
                    }

                    for (const r of refData.ranges) {
                        if (r.category === category) {
                            totalScore += r.score;
                            break;
                        }
                    }
                }
                break;
            case "IMC":
                const imcVal = healthRecord['IMC_valor'];
                if (imcVal !== undefined) {
                    let category = "";
                    if (imcVal >= 18.5 && imcVal <= 24.9) {
                        category = "NORMAL";
                    } else if (imcVal >= 25.0 && imcVal <= 29.9) {
                        category = "SOBREPESO";
                    } else if (imcVal >= 30.0) {
                        category = "OBESIDADE";
                    }
                    for (const r of refData.ranges) {
                        if (r.category === category) {
                            totalScore += r.score;
                            break;
                        }
                    }
                }
                break;
            case "Circunferência Abdominal":
                if (gender === "masculino") {
                    if (value < 94) totalScore += 0;
                    else if (value >= 94 && value <= 102) totalScore += 1;
                    else if (value > 102) totalScore += 2;
                } else if (gender === "feminino") {
                    if (value < 80) totalScore += 0;
                    else if (value >= 80 && value <= 88) totalScore += 1;
                    else if (value > 88) totalScore += 2;
                }
                break;
            case "Gama GT":
            case "Creatina":
                for (const r of refData.ranges) {
                    if (gender === "masculino") {
                        if ('male_max' in r && value <= r.male_max) { totalScore += r.score; break; }
                        if ('male_min' in r && value >= r.male_min) { totalScore += r.score; break; }
                    } else if (gender === "feminino") {
                        if ('female_max' in r && value <= r.female_max) { totalScore += r.score; break; }
                        if ('female_min' in r && value >= r.female_min) { totalScore += r.score; break; }
                    }
                }
                break;
            default: // Exames laboratoriais gerais e Sono
                for (const r of refData.ranges) {
                    if ('min' in r && 'max' in r) {
                        if (value >= r.min && value <= r.max) {
                            totalScore += r.score;
                            break;
                        }
                    } else if ('min' in r && !('max' in r)) {
                        if (value >= r.min) {
                            totalScore += r.score;
                            break;
                        }
                    } else if ('max' in r && !('min' in r)) {
                        if (value <= r.max) {
                            totalScore += r.score;
                            break;
                        }
                    }
                }
                break;
        }
    }
    return totalScore;
};

const getIsgClassification = (score) => {
    if (score >= 0 && score <= 9) {
        return { classification: "RISCO BAIXO", score_level: 1 };
    } else if (score >= 10 && score <= 19) {
        return { classification: "RISCO MÉDIO", score_level: 2 };
    } else if (score >= 20) {
        return { classification: "RISCO ALTO", score_level: 3 };
    }
    return { classification: "N/A", score_level: 0 };
};

const getIsgMessage = (classification, isg_score_level) => {
    const messageTemplate = MESSAGES[classification];
    if (messageTemplate) {
        return messageTemplate.message.replace('{isg_score_level}', isg_score_level);
    }
    return "Mensagem não encontrada para esta classificação.";
};

module.exports = {
    calculateIsgScore,
    getIsgClassification,
    getIsgMessage
};