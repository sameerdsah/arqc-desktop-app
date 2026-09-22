pipeline {
    agent { label 'windows' }
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_DEFAULT_REGION = 'eu-north-1'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build Installer') {
            steps {
                bat 'npm run dist'
            }
        }
        stage('Upload to S3') {
            steps {
                bat '''
                    for %%f in (dist\\*.exe) do (
                        aws s3 cp "%%f" s3://arqc-desktop-releases/latest/
                    )
                '''
            }
        }
    }
}