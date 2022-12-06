// def branch = env.sha1
def branch = 'staging'

def checkoutCommit(commit) {
    checkout([
        $class           : 'GitSCM',
        branches         : [[name: commit]],
        userRemoteConfigs: [[
                credentialsId: '6fdbf0f9-8646-414e-8079-d03d2fcdff1a',
                url          : 'git@github.com:MEDIARITHMICS/mediarithmics-client-universe.git'
        ]]
    ])
}

pipeline {
    agent any
    parameters {
        booleanParam(name: 'navigator',
            defaultValue: true,
            description: 'set to true to publish navigator artifact on Nexus ')
        booleanParam(name: 'computing_console',
            defaultValue: false,
            description: 'set to true to publish computing console artifact on Nexus ')
        booleanParam(name: 'advanced_components',
            defaultValue: false,
            description: 'set to true to publish advanced components website artifact on Nexus ')
        booleanParam(name: 'basic_components',
            defaultValue: false,
            description: 'set to true to publish basic components website artifact on Nexus ')
        booleanParam(name: 'END_TO_END_CHECK',
	        defaultValue: true,
	        description: 'set to false to bypass the virtual platform creation and the cypress tests')
        string(name: 'GIVEN_VIRTUAL_PLATFORM_NAME',
            defaultValue: '',
            description: 'If you would like to run the tests on a precedently created virtual platform (For example if a previous build fails because of false positive tests) please provide its name')
        string(name: 'GIVEN_VIRTUAL_PLATFORM_ID',
            defaultValue: '',
            description: 'Please provide the given virtual platforms id so that it would be killed properly')  
    }
    stages {
            stage('Checkout') {
                agent {
                    label "front-staging"
                }
                steps {
                    script {
                        checkoutCommit(branch)
                        GIT_COMMIT_REV = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%H'").trim()
                    }
                }
            }
            stage('Starting mediarithmics-client-universe parallel stages...') {
                parallel {
                    stage('Navigator stages') {
                        stages('Substeps...')  {
                            stage('Building and Publishing Navigator Staging Artifacts'){
                                when {
                                    // Only publish staging if END_TO_END_CHECK == true
                                    expression { params.END_TO_END_CHECK == true && params.GIVEN_VIRTUAL_PLATFORM_NAME == '' }
                                }
                                steps {
                                    echo 'Running mediarithmics-navigator-publish-zip (staging)'
                                    build job: 'mediarithmics-navigator-publish-zip'
                                }
                            }
                            stage('Virtual Platform Creation') {
                                when {
                                    // Only create sandbox if END_TO_END_CHECK == true
                                    expression { params.END_TO_END_CHECK == true && params.GIVEN_VIRTUAL_PLATFORM_NAME == ''}
                                }
                                steps {
                                    script {
                                        echo 'Running Virtual Platform Creation Job'
                                        def user_id = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')?.userId[0]
                                        sandbox_build = build job: 'sandbox-creation-from-template', parameters: [
                                            [$class: 'StringParameterValue', name: 'template', value: "master"],
                                            [$class: 'StringParameterValue', name: 'lifetime', value: "1"],
                                            [$class: 'StringParameterValue', name: 'custom_navigator_build', value: "staging-1+"],
                                            [$class: 'StringParameterValue',  name: 'parent_job_name', value: "mediarithmics-navigator-pipeline"],
                                            [$class: 'StringParameterValue',  name: 'parent_job_id', value: build_id],
                                            [$class: 'StringParameterValue',  name: 'user_id', value: user_id],
                                        ]
                                    copyArtifacts projectName: 'sandbox-creation-from-template', selector: specific("${sandbox_build.number}"), filter: 'output.json'
                                    props = readJSON file: 'output.json'
                                    VIRTUAL_PLATFORM_NAME = props['data']['name']
                                    echo "Got the virtual platform ${VIRTUAL_PLATFORM_NAME} (build #${sandbox_build.number})"
                                    VIRTUAL_PLATFORM_ID = props['data']['id']
                                    echo "Got the virtual platform id ${VIRTUAL_PLATFORM_ID} (build #${sandbox_build.number})"
                                    }
                                }
                            }
                            stage('Cypress Parallel Tests On Given Virtual Platform'){
                                when {
                                    expression { params.GIVEN_VIRTUAL_PLATFORM_NAME != '' }
                                }
                                steps {
                                    echo 'Running Cypress end-to-end front-end scenarios'
                                    build job: 'cypress-navigator-pipeline-tests/cypress tests', parameters: [[$class: 'StringParameterValue', name: 'VIRTUAL_PLATFORM_NAME', value: "${params.GIVEN_VIRTUAL_PLATFORM_NAME}"]]
                                }
                            }
                            stage('Cypress Parallel Tests On Created Virtual Platform'){
                                when {
                                    // Only run end to end scenarios is END_TO_END_CHECK == true
                                    expression { params.END_TO_END_CHECK == true && params.GIVEN_VIRTUAL_PLATFORM_NAME == ''}
                                }
                                steps {
                                    echo 'Running Cypress end-to-end front-end scenarios'
                                    build job: 'cypress-navigator-pipeline-tests/cypress tests', parameters: [[$class: 'StringParameterValue', name: 'VIRTUAL_PLATFORM_NAME', value: "${VIRTUAL_PLATFORM_NAME}"]]
                                }
                            }
                            stage('Push to master') {
                                agent {
                                    label "master"
                                }
                                steps {
                                    checkoutCommit(GIT_COMMIT_REV)
                                    echo 'Pushing to master'
                                    build job: 'mediarithmics-navigator-push-to-master', parameters: [[$class: 'StringParameterValue', name: 'revision', value: "${GIT_COMMIT_REV}"]]
                                }
                            }
                            stage('Building and Publishing Navigator Artifacts'){
                                when {
                                    expression { params.END_TO_END_CHECK == true && params.GIVEN_VIRTUAL_PLATFORM_NAME == '' }
                                }
                                steps {
                                    echo 'Start of navigator zip process (master)'
                                    sh 'cd $WORKSPACE/navigator && ./build-support/jenkins/master.sh $BUILD_NUMBER'
                                }
                            }
                        }
                    }
                    stage('Building and Publishing Computing Console Artifact') {
                        when {
                            expression { params.computing_console == true }
                        }
                        steps {
                            echo 'Running computing_console-publish-zip'
                            sh 'cd $WORKSPACE/computing-console && ./build-support/jenkins/master.sh $BUILD_NUMBER'
                        }
                    }
                    stage('Building and Publishing Advanced Components Website Artifact (Cosmos)') {
                        when {
                            expression { params.advanced_components == true }
                        }
                        steps {
                            echo 'Running advanced-components-publish-zip'
                            sh 'cd $WORKSPACE/components/advanced && ./build-support/jenkins/master.sh $BUILD_NUMBER'
                        }
                    }
                    stage('Building and Publishing Basic Components Website Staging Artifact (Cosmos)') {
                         when {
                             expression { params.basic_components == true }
                         }
                         steps {
                            echo 'Running basic-components-publish-zip'
                             sh 'cd $WORKSPACE/components/basic/mcs-react-components && ./build-support/jenkins/master.sh $BUILD_NUMBER'
                         }
                    }
                }
        }
    }
    post {
        always {
            script {
                if (params.END_TO_END_CHECK == true && params.GIVEN_VIRTUAL_PLATFORM_ID == '') {
                    echo 'Kill virtual platform used for end-to-end tests'
                    build job: 'sandbox-metal-delete', parameters: [[$class: 'StringParameterValue', name: 'id', value: "${VIRTUAL_PLATFORM_ID}"]]
                }
            }
        }
        failure {
            echo 'The staging build failed.'
        }
    }
}