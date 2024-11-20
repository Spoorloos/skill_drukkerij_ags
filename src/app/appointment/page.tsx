export default function Appointment() {
    return (
        <main className="flex p-8 items-center flex-col">
            <h1 className="font-bold text-xl">Appointment</h1>
            <form className="flex gap-4 flex-col w-[clamp(10rem,70vw,30rem)]">
                <label htmlFor="subject">Subject</label>
                <input className="p-1 border-2 border-blue-300 rounded-lg" id="subject" type="text" required/>


                <label htmlFor="description">Description</label>
                <textarea className="p-1 rounded-lg h-40 border-2 border-blue-300" id="description"></textarea>


                <label htmlFor="people_to_add">People to add:</label>
                <input className="p-1 rounded-lg border-2 border-blue-300" id="people_to_add" type="text" />

                <div>
                    <p>add everyone:</p>
                    <input className="w-5 h-5" type="checkbox" />
                </div>



                <label htmlFor="date">Date</label>
                <input className="p-1 rounded-lg border-2 border-blue-300" id="date" type="date" required/>


                <label htmlFor="time">Time</label>
                <input className="p-1 rounded-lg border-2 border-blue-300" id="time" type="time" required/>
                <input className="p-1 rounded-lg border-2 border-blue-300" id="time" type="time" required/>


                <label htmlFor="location">Location</label>
                <input className="p-1 rounded-lg border-2 border-blue-300" id="location" type="text" />


                <button type="submit" className="p-3 rounded-lg bg-blue-300">test</button>

            </form>
        </main>
    );
}