const axios = require('axios')

describe('user login', function () {
    let res = {}

    beforeAll(async () => {
        res = await axios({
            method: "get",
            url: "http://localhost:3000/users/login", 
            data: {
                email: "tessto@test.tet",
                password: "power"
            }
        })
    })

    test('user login status 200', () => {
        expect(res.status).toBe(200)
    });

    test('user login responce data', () => {

        expect(res).toMatchObject({
            data: {
                user: { 
                    email: 'tessto@test.tet', 
                    subscription: 'starter' 
                },
            }
        });
    });

    test('user login responce has token', () => {
        expect(res.data.token).toBeTruthy()
    });
})