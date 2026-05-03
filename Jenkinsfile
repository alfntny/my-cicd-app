pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'alfntny'
        IMAGE_NAME = "${DOCKERHUB_USER}/my-cicd-app"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '--- Pulling code from GitHub ---'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '--- Building Docker image ---'
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '--- Pushing image to Docker Hub ---'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '--- Deploying to Minikube ---'
                sh "kubectl apply -f k8s/deployment.yaml"
                sh "kubectl apply -f k8s/service.yaml"
                sh "kubectl rollout restart deployment/my-cicd-app"
                sh "kubectl rollout status deployment/my-cicd-app"
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '--- Verifying pods ---'
                sh "kubectl get pods -l app=my-cicd-app"
                sh "kubectl get service my-cicd-app-service"
            }
        }
    }

    post {
        success { echo '✅ Pipeline completed successfully!' }
        failure { echo '❌ Pipeline failed. Check logs above.' }
    }
}
