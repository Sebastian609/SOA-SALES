pipeline {
    agent any
    tools {
        nodejs "node" // Asegúrate de que "node" esté correctamente configurado en Jenkins
    }

    environment {
        NODE_HOME = '/usr/local/bin' // Cambia según tu instalación de Node.js
        PATH = "${NODE_HOME}:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Compilando TypeScript...'
                sh 'npm run build'
            }
        }

    
        stage('Deploy Application') {
            steps {
                sh 'pm2 startOrRestart ecosystem.config.js --update-env'
                sh 'pm2 list'
            }
        }
    } // Aquí termina el bloque `stages`

    post {
        always {
            script {
                sh 'pm2 save' // Guarda la configuración actual de PM2
            }
        }
        success {
            echo '¡Despliegue exitoso!'
        }
        failure {
            echo 'El despliegue falló. Revisa los logs.'
        }
    }
} // Aquí termina el bloque `pipeline`
