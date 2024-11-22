type EventCard = Readonly<{
    name: string;
    time: string;
    description: string;
}>;

export default function EventCard({ name, time, description }: EventCard) {
    return (
        <article className="max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
            <h4 className="mb-4 text-xl font-bold text-center text-gray-800">{name}</h4>
            <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Time: </span><time dateTime={time}>{time}</time>
            </p>
            <p className="text-sm text-gray-600">
                <span className="font-semibold">Description: </span>{description}
            </p>
        </article>
    );
}