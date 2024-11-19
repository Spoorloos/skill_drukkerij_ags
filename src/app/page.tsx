export default function Home() {
    return (
        <main>
            <table className="w-1/2 border-collapse border border-black table-fixed">
                <tr className="border border-black">
                    <th className="border border-black">Monday</th>
                    <th className="border border-black">Tuesday</th>
                    <th className="border border-black">Wednesday</th>
                    <th className="border border-black">Thursday</th>
                    <th className="border border-black">Friday</th>
                </tr>
                <tr className="border border-black">
                    <td className="border border-black">Alfreds Futterkiste</td>
                    <td className="border border-black">Maria Anders</td>
                    <td className="border border-black">Germany</td>
                </tr>
                <tr className="border border-black">
                    <td className="border border-black">Centro comercial Moctezuma</td>
                    <td className="border border-black">Francisco Chang</td>
                    <td className="border border-black">Mexico</td>
                </tr>
            </table>
        </main>
    );
}
