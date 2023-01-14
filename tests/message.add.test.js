test('Testing create message API', () => {
    const body = JSON.stringify({ username: 'test-user', content: 'test'});

    const promise = fetch('http://localhost:3000/api/message', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body
    })
    .then(res => res.json(jsn => {
        expect(jsn).toBeInstanceOf(Object);
        return Promise.resolve();
    }));
});