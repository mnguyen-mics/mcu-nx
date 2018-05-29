import { defineMessages } from 'react-intl';

export default defineMessages({
    saveMobileApp: {
        id: 'settings.mobileapp.form.saveMobileApp',
        defaultMessage: 'Save Mobile Application'
    },
    sectionGeneralTitle: {
        id: 'settings.mobileapp.form.general.title',
        defaultMessage: 'General Information'
    },
    sectionVisitAnalyzerTitle: {
        id: 'settings.mobileapp.form.visitAnalayzer.title',
        defaultMessage: 'Visit Analyzer'
    },
    sectionEventRulesTitle: {
        id: 'settings.mobileapp.form.section.eventRules.title',
        defaultMessage: 'Event Rules'
    },
    sectionGeneralSubTitle: {
        id: 'settings.mobileapp.form.general.subtitle',
        defaultMessage: 'Give your Mobile Application a name',
    },
    contentSectionGeneralNameLabel: {
        id: 'settings.mobileapp.form.general.label',
        defaultMessage: 'Name',
    },
    contentSectionGeneralNamePlaceholder: {
        id: 'settings.mobileapp.form.general.placeholder',
        defaultMessage: 'Mobile Application Name',
    },
    contentSectionGeneralNameTooltip: {
        id: 'settings.mobileapp.form.general.tooltip',
        defaultMessage: 'Give your Mobile Application a Name',
    },
    contentSectionGeneralTokenLabel: {
        id: 'settings.mobileapp.form.general.token.label',
        defaultMessage: 'Token',
    },
    contentSectionGeneralTokenPlaceholder: {
        id: 'settings.mobileapp.form.general.token.placeholder',
        defaultMessage: 'Mobile Application Token',
    },
    contentSectionGeneralTokenTooltip: {
        id: 'settings.mobileapp.form.general.token.tooltip',
        defaultMessage: 'Give your Mobile Application a unique token to identify your app. This token can be comprised with charaters as well as numbers',
    },
    
    errorFormMessage: {
        id: 'settings.mobileapp.form.errorMessage',
        defaultMessage: 'There is an error with the data you have inputed, please check'
    },
    savingInProgress: {
        id: 'settings.mobileapp.form.savingInProgress',
        defaultMessage: 'Saving your Mobile App'
    },
    createMobileApplicationTitle: {
        id: 'settings.mobileapp.form.create',
        defaultMessage: 'New Mobile Application'
    },
    editMobileApplicationTitle: {
        id: 'settings.mobileapp.form.edit',
        defaultMessage: 'Edit {name}'
    },
    breadcrumbTitle1: {
        id: 'settings.mobileapp.form.settings',
        defaultMessage: 'Mobile Applications'
    },
    warningOnTokenEdition: {
        id: 'settings.datamart.warning.token.edition',
        defaultMessage: 'Danger Zone: Editing this token may cause any mobile application data collection to fail if not updated properly. Please make sure you have updated your tag in all your mobile apps before saving.'
    }
})
