function Test() {
    const appointments = [
        {
            subject: 'Pizza Party 22',
            date: '2024-11-22',
            start: '10:00',
            end: '12:00',
            description: 'loirem'
        },
        {
            subject: 'Pizza Party 22',
            date: '2024-11-22',
            start: '10:00',
            end: '12:00',
            description: 'loirem'
        },
        {
            subject: 'Pizza Pasdsasdarty 23',
            date: '2024-11-23',
            start: '12:00',
            end: '14:00',
            description: 'loirem'
        },
        {
            subject: 'Pizza Pasdsasdarty 23',
            date: '2024-11-23',
            start: '12:00',
            end: '14:00',
            description: 'loirem'
        }
    ];

    return (

        appointments.map((appointment, index) => (
            <li>
                <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
                    <h4 className="mb-4 text-xl font-bold text-center text-gray-800">{appointment.subject}</h4>
                    <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold">Time: </span><time>{appointment.start} {appointment.end}</time>
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Description:</span>{appointment.description}
                    </p>
                </article>
            </li>
        ))

    );
}
export default Test;
// <div>
//     {days.map((day, index) => (
//         <h4 key={index}>{day}</h4>
//     ))}
// </div>

{/* <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
    <h4 className="mb-4 text-xl font-bold text-center text-gray-800">Pizza Party</h4>
    <p className="mb-2 text-sm text-gray-600">
        <span className="font-semibold">Time: </span><time keys={index}>{time}</time>
    </p>
    <p className="text-sm text-gray-600">
        <span className="font-semibold">Description:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
</article> */}