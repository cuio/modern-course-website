import { useState } from "react";
import { db } from "./firebase";
import { getDocs, collection } from "@firebase/firestore";

function App() {
  const [data, setData] = useState([]);

  return (
    <div>
      <h1>Modern Course App</h1>
      <p>
        <button
          onClick={() => {
            setData(() => {
              return [];
            });
            getDocs(collection(db, "CSE")).then((querySnapshot) => {
              querySnapshot.forEach((e) => {
                let kvp = e.data();
                let data = { code: e.id, name: kvp.name, seats: kvp.seats };
                setData((prevState) => {
                  return [...prevState, data];
                });
              });
            });
          }}
        >
          Fetch CSE collection
        </button>
      </p>
      {data.length > 0 && (
        <table>
          <thead>
            <tr key="header">
              <th style={{ border: "1px solid black" }}>Code</th>
              <th style={{ border: "1px solid black" }}>Name</th>
              <th style={{ border: "1px solid black" }}>Seats</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => {
              return (
                <tr key={e.code}>
                  <td style={{ border: "1px solid black" }}>{e.code}</td>
                  <td style={{ border: "1px solid black" }}>{e.name}</td>
                  <td style={{ border: "1px solid black" }}>{e.seats}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
