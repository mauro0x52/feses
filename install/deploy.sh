#!/bin/bash

# ------------------------------------------------------------------------------
# Deploy Auth
# ------------------------------------------------------------------------------
# Script para atualizar o ambiente de producao em nodejs quando houver
# alteracoes no codigo do serviço.
#
# Exemplos de crontab:
#
#     A cada 10 minutos
#     */10 * * * * cd /path/to/deploy/folder/; bash deploy.sh;
# ------------------------------------------------------------------------------

SERVICE='feses'
source config.sh

# Funcao principal
deploy() {

    echo ""
    echo "------------------------------------------------------------"
    echo "Iniciando deploy do serviço $SERVICE"
    echo "------------------------------------------------------------"
    echo ""

    echo "- Puxando alteracoes do serviço $SERVICE..."
    git fetch

    echo ""
    echo "- Verificando alteracoes do $SERVICE..."
    GIT_UPDATES_TOTAL=$(git diff $CONFIG_GIT_REPOSITORY/$CONFIG_GIT_BRANCH | grep -c a/)
    echo "-- $GIT_UPDATES_TOTAL atualizacoes encontradas."

    if [ $GIT_UPDATES_TOTAL != 0 ]
    then

        echo ""
        echo "------------------------------------------------------------"
        echo "Reiniciando serviço $SERVICE"
        echo "------------------------------------------------------------"
        echo ""

        echo "- Reiniciando serviço"
        forever stop $SERVICE.js

        echo "- Atualizando codigo do serviço..."
        bash install.sh

        cd ..
        forever start $SERVICE.js
        cd install
    else

        echo
        echo "- Nenhuma alteração encontrada para o serviço $SERVICE"
    fi
}

# Chamada da funcao
deploy
