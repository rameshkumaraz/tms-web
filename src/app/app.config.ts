import { environment } from './../environments/environment';
export class AppSettings {
    public static API_CONTEXT = environment.apiURL;
    public static API_KEY = environment.apiKey;
    public static DEVICE_IMAGE_CONTEXT = "https://tms-app-libraries.s3.us-east-2.amazonaws.com/model-images/";

    public static ENDPOINTS = {
        'login': 'auth/login',
        'refresh': 'auth/refresh',
        'merchant': {
            'endpoint': 'merchant',
            'path': {
                'filter': 'f'
            }
        },
        'location': {
            'endpoint': 'location',
            'path': {
                'merchant': 'm',
                'relations': 'r',
                'filter': 'f'
            }
        },
        // 'locationsForMerchant': 'location/m',
        'device': {
            'endpoint': 'device',
            'path': {
                'location': 'l',
                'merchant': 'm',
                'details': 'd',
                'relations': 'r',
                'events': 'el',
                'filter': 'f'
            }
        },
        // 'devicesForLocation': 'device/l',
        'deviceBrand': {'endpoint': 'db'},
        'deviceModel': {'endpoint': 'dm'},
        'user': {
            'endpoint': 'users',
            'path': {
                'admin': 'a',
                'merchant': 'm'
            }
        },
        // 'usersForAdmin': 'users/a',
        // 'usersForMerchant': 'users/m',
        'policy': {'endpoint': 'policy'},
        'role': {
            'endpoint': 'roles',
            'path': {
                'merchant': 'm'
            }
        },
        // 'role': 'roles',
        // 'rolesForMerchant': 'roles/m',
        'app': {
            'endpoint': 'app',
            'path': {
                'merchant': 'm'
            }
        },
        // 'application': 'app',
        // 'applicationsForMerchant': 'app/m',
        'lib': {
            'endpoint': 'lib',
            'path': {
                'merchant': 'm',
                'app': 'a',
                'appLatest': 'al'
            }
        },
        // 'library': 'lib',
        // 'librariesForLocation': 'lib/a',
        // 'latestForLocation': 'lib/l',
        // 'job': 'jobs',
        // 'jobForMerchant': 'jobs/m',
        'job': {
            'endpoint': 'jobs',
            'path': {
                'merchant': 'm'
            }
        },
        // 'appParams': 'params',
        // 'appParamsByApp': 'params/a'
        'appParam': {
            'endpoint': 'params',
            'path': {
                'app': 'a',
                'merchant': 'm',
                'template': 't'
            }
        },
        'adminUser' : {'endpoint': 'admin/user'},
        'dashboard' : {
            'endpoint' : 'dashboard',
            'path': {
                'merchant': 'm',
                'location': 'l',
                'device': 'd'
            }
        },
        'mdashboard' : {
            'endpoint' : 'mdashboard',
            'path': {
                'location': 'l',
                'device': 'd',
                'job' : 'j',
                'model' : 'dm',
                'category' : 'c'
            }
        },
        'password' : {
            'endpoint' : 'password',
            'path': {
                'reset': 'r',
                'verify': 'v',
                'forgot': 'f'
            }
        }
    };
}