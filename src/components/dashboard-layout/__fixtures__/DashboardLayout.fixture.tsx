import React from 'react';
import DashboardLayout from '../DashboardLayout'
import { FetchMock } from '@react-mock/fetch'
import { LocalStorageMock } from '@react-mock/localstorage'
import { MockedData } from '../../chart-engine/MockedData';

const props = {
    datamart_id: "1414",
    schema: {
        "sections": [
            {
                "title": "General Information",
                "cards": [
                    {
                        "x": 0,
                        "y": 0,
                        "w": 12,
                        "h": 6,
                        "layout": "horizontal",
                        "charts": [
                            {
                                "title": "Age range",
                                "type": "Pie",
                                "dataset": {
                                    "type": "OTQL",
                                    "query_id": "50172"
                                }
                            },
                            {
                                "title": "Age range",
                                "type": "Pie",
                                "dataset": {
                                    "type": "OTQL",
                                    "query_id": "50172"
                                }
                            },
                            {
                                "title": "Device form factors",
                                "type": "Bars",
                                "dataset": {
                                    "type": "OTQL",
                                    "query_id": "50171"
                                },
                                "options": {
                                    "xKey": "key"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Demographics",
                "cards": [
                    {
                        "x": 0,
                        "y": 0,
                        "w": 12,
                        "h": 4,
                        "charts": [
                            {
                                "title": "Gender",
                                "type": "Pie",
                                "dataset": {
                                    "type": "OTQL",
                                    "query_id": "50168"
                                },
                                "options": {
                                    "legend": {
                                        "enabled": true,
                                        "position": "right"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "x": 0,
                        "y": 0,
                        "w": 6,
                        "h": 4,
                        "charts": [
                            {
                                "title": "Age range",
                                "type": "Pie",
                                "dataset": {
                                    "type": "OTQL",
                                    "query_id": "50172"
                                }
                            }
                        ]
                    },
                    {
                        "x": 6,
                        "y": 0,
                        "w": 6,
                        "h": 4,
                        "charts": [
                            {
                                "title": "Social class",
                                "type": "Bars",
                                "dataset": {
                                    "type": "OTQL",
                                    "query_id": "50169"
                                },
                                "options": {
                                    "type": "bar",
                                    "xKey": "key"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Behavioral",
                "cards":
                    [
                        {
                            "x": 0,
                            "y": 0,
                            "w": 6,
                            "h": 4,
                            "charts": [
                                {
                                    "title": "Top 10 interests",
                                    "type": "Radar",
                                    "dataset": {
                                        "type": "OTQL",
                                        "query_id": "50167"
                                    },
                                    "options": {
                                        "xKey": "key"
                                    }
                                }
                            ]
                        },
                        {
                            "x": 6,
                            "y": 0,
                            "w": 6,
                            "h": 4,
                            "charts": [
                                {
                                    "title": "Top 10 purchase intents",
                                    "type": "Bars",
                                    "dataset": {
                                        "type": "OTQL",
                                        "query_id": "50173"
                                    }
                                }
                            ]
                        }
                    ]
            }
        ]
    }
}

const fetchmockOptions = [
    { matcher: 'glob:/undefined/v1/datamarts/*/queries/*', response: { data: "Select @count() from UserPoint" } },
    { matcher: 'glob:/undefined/v1/datamarts/1414/query_executions/otql*', response: MockedData }
]

export default {
    component:
        <LocalStorageMock
            items={{ access_token: 're4lt0k3n' }}
        >
            <FetchMock mocks={fetchmockOptions}>
                <DashboardLayout {...props}></DashboardLayout>
            </FetchMock>
        </LocalStorageMock>
};