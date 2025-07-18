import React from "react";

const systemUses = [
    "Track patient appointments",
    "Manage treatment history",
    "Monitor patient progress",
    "Securely store patient records",
    "Facilitate communication with patients",
    "Generate reports for analysis",
];

function Data() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">System Uses</h2>
            <ul className="space-y-2">
                {systemUses.map((use, idx) => (
                    <li
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow"
                    >
                        {use}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Data;
