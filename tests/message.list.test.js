test('Testing message list API', async () => {
    const promise = fetch('http://localhost:3000/api/message')
    .then(res => res.json(jsn => {
        expect(jsn).toBeInstanceOf(Array)
        return Promise.resolve();
    }));
});