#!/bin/bash

# ------------------------------------------------------------------------------
# Install
# ------------------------------------------------------------------------------
# Script para instalar o serviço de Auth
# ------------------------------------------------------------------------------

SERVICE='feses'
source config.sh

# Funcao principal
install() {

    echo ""
    echo "------------------------------------------------------------"
    echo "Instalando serviço $SERVICE"
    echo "------------------------------------------------------------"
    echo ""

    cd ..

    # config.js

    if [ ! -f config.js ];
    then
        cp config.js.default config.js
        echo "- config.js copiado"
    else
        echo "- config.js já existe"

        CONFIGJS_MODDATE=$(stat -c %Y config.js)
        CONFIGJSDEFAULT_MODDATE=$(stat -c %Y config.js.default)
        if [ ${CONFIGJSDEFAULT_MODDATE} -gt ${CONFIGJS_MODDATE} ]
        then
            echo -e "\033[31m" #vermelho
            echo "- seu config.js está desatualizado!"
            echo -e "\033[37m" #branco
        fi
    fi

    # atualiza pacotes

    echo "- Instalando e atualizando pacotes"
    npm update &>/dev/null &

    echo "- Atualizando código"
    git pull

    # volta para pasta do install
    cd ..

}

# Chamada da funcao
install