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
            when {
                changeset "server/**"
            }
            steps {
                dir('server') {
                    script {
                        dockerImageServer = docker.build("${IMAGE_NAME_SERVER}:latest")
                    }
                }
            }
        }

        stage('Build Client Image') {
            when {
                changeset "client/**"
            }
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
                    when {
                        changeset "server/**"
                    }
                    steps {
                        script {
                            bat """
                            docker run --rm ^
                            -v //var/run/docker.sock:/var/run/docker.sock ^
                            -v trivy-cache:/root/.cache/ ^
                            aquasec/trivy:latest image --exit-code 0 --severity CRITICAL ${IMAGE_NAME_SERVER}:latest
                            """
                        }
                    }
                }
                stage('Scan Client') {
                    when {
                        changeset "client/**"
                    }
                    steps {
                        script {
                            bat """
                            docker run --rm ^
                            -v //var/run/docker.sock:/var/run/docker.sock ^
                            -v trivy-cache:/root/.cache/ ^
                            aquasec/trivy:latest image --exit-code 0 --severity CRITICAL ${IMAGE_NAME_CLIENT}:latest
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
                        withCredentials([usernamePassword(
                            credentialsId: DOCKERHUB_CREDENTIALS_ID,
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )]) {
                            script {
                                // Only push server if it changed
                                if (dockerImageServer) {
                                    bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                                    bat "docker push ${IMAGE_NAME_SERVER}:latest"
                                }
                                // Only push client if it changed
                                if (dockerImageClient) {
                                    bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                                    bat "docker push ${IMAGE_NAME_CLIENT}:latest"
                                }
                                bat "docker logout"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            bat '''
            docker system prune -f
            docker image prune -a -f
            '''
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}