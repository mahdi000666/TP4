def dockerImageServer
def dockerImageClient

pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'
        IMAGE_NAME_SERVER = 'mahdi000666/mern-server'
        IMAGE_NAME_CLIENT = 'mahdi000666/mern-client'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Server Image') {
            steps {
                dir('server') {
                    script {
                        dockerImageServer = docker.build("${IMAGE_NAME_SERVER}:latest")
                    }
                }
            }
        }

        stage('Build Client Image') {
            steps {
                dir('client') {
                    script {
                        dockerImageClient = docker.build("${IMAGE_NAME_CLIENT}:latest")
                    }
                }
            }
        }

        stage('Scan Images') {
            parallel {
                stage('Scan Server') {
                    steps {
                        script {
                            bat """
                            docker run --rm -v //var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 0 --severity LOW,MEDIUM,HIGH,CRITICAL ${IMAGE_NAME_SERVER}:latest
                            """
                        }
                    }
                }
                stage('Scan Client') {
                    steps {
                        script {
                            bat """
                            docker run --rm -v //var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 0 --severity LOW,MEDIUM,HIGH,CRITICAL ${IMAGE_NAME_CLIENT}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {
                        docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                            retry(2) {
                                dockerImageServer.push('latest')
                            }
                            retry(2) {
                                dockerImageClient.push('latest')
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            bat 'docker system prune -f'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}