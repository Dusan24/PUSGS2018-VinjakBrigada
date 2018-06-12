export class Users{
    
        constructor(
            public FullName: string,
            public Email: string,
            public Password: string,
            public RepeatedPassword: string,
            public DateBirth: Date
        ){ }
    }