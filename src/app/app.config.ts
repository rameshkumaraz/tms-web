export class AppSettings {
    public static API_CONTEXT = 'http://localhost:3000/';

    public static ENDPOINTS = {
        'login': 'auth/login',
        'merchant': 'merchant',
        'location': 'location',
        'locationsForMerchant': 'location/m',
        'device': 'device',
        'devicesForLocation': 'device/l',
        'deviceBrand': 'db',
        'deviceModel': 'dm',
        'user': 'users',
        'usersForAdmin': 'users/a',
        'usersForMerchant': 'users/m',
        'role': 'roles',
        'rolesForMerchant': 'roles/m',
        'application': 'app',
        'applicationsForMerchant': 'app/m',
        'library': 'lib',
        'librariesForLocationn': 'lib/a'
    };
}