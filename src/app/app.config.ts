export class AppSettings {
    public static API_CONTEXT = 'http://localhost:3000/';

    public static ENDPOINTS = {
        'login': 'auth/login',
        'merchant': {'endpoint': 'merchant'},
        'location': {
            'endpoint': 'location',
            'path': {
                'merchant': 'm'
            }
        },
        // 'locationsForMerchant': 'location/m',
        'device': {
            'endpoint': 'device',
            'path': {
                'location': 'l',
                'merchant': 'm'
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
            'endpoint': 'appParam',
            'path': {
                'app': 'a'
            }
        },
        'adminUser' : {'endpoint': 'admin/user'}
    };
}