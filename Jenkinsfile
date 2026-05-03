pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "chirag21032004/webapp-demo"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %DOCKER_IMAGE%:%TAG% ."
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'chirag21032004',
                    passwordVariable: 'Welcome@1'
                )]) {
                    bat "docker login -u %USER% -p %PASS%"
                }
            }
        }

        stage('Push Image') {
            steps {
                bat "docker push %DOCKER_IMAGE%:%TAG%"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat "kubectl set image deployment/mywebapp webapp-demo=%DOCKER_IMAGE%:%TAG%"
            }
        }
    }
}