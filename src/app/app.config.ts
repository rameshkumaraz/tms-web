export class AppSettings {
    public static API_CONTEXT = 'http://localhost:3000/';

    public static ENDPOINTS = {
        'login': 'auth/login',
        'merchant': 'merchant',
        'location': 'location',
        'locationForMerchant': 'location/m',
        'device': 'device',
        'deviceForLocation': 'device/l',
        'deviceBrand': 'db',
        'deviceModel': 'dm',
        'user': 'users',
        'role': 'roles'
    };
}