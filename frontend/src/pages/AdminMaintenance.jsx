import { useEffect, useState } from "react";

import axios from "axios";

function AdminMaintenance() {

  const [requests, setRequests] =
    useState([]);

  // =========================
  // ADMIN INFO
  // =========================
  const adminInfo =
    JSON.parse(
      localStorage.getItem(
        "adminInfo"
      )
    );

  const token =
    adminInfo?.token;

  // =========================
  // FETCH REQUESTS
  // =========================
  useEffect(() => {

    fetchRequests();

  }, []);

  const fetchRequests =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        };

        const res =
          await axios.get(

            "http://localhost:5000/api/maintenance",

            config
          );

        setRequests(
          res.data
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to fetch requests"
        );
      }
    };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        };

        await axios.put(

          `http://localhost:5000/api/maintenance/${id}`,

          {
            status,
          },

          config
        );

        fetchRequests();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update status"
        );
      }
    };

  return (

    <div
      style={{
        minHeight:
          "100vh",

        padding:
          "40px",

        background:
          "#f4f4f4"
      }}
    >

      <h1
        style={{
          textAlign:
            "center",

          marginBottom:
            "40px",

          color:
            "#1e3c72"
        }}
      >
        Maintenance Requests 🛠️
      </h1>

      {requests.length === 0 ? (

        <h2
          style={{
            textAlign:
              "center"
          }}
        >
          No Requests Found
        </h2>

      ) : (

        requests.map((request) => (

          <div
            key={request._id}

            style={{
              background:
                "white",

              padding:
                "25px",

              borderRadius:
                "16px",

              marginBottom:
                "25px",

              boxShadow:
                "0 5px 15px rgba(0,0,0,0.1)"
            }}
          >

            {/* USER */}
            <h2>
              {request.user?.name}
            </h2>

            <p>
              {request.user?.email}
            </p>

            {/* PRODUCT */}
            <h3
              style={{
                marginTop:
                  "20px"
              }}
            >
              Product:
              {" "}
              {
                request.product
                  ?.name
              }
            </h3>

            {/* ISSUE */}
            <p
              style={{
                marginTop:
                  "15px",

                lineHeight:
                  "1.8"
              }}
            >
              <strong>
                Issue:
              </strong>
              {" "}
              {request.issue}
            </p>

            {/* STATUS */}
            <div
              style={{
                marginTop:
                  "20px"
              }}
            >

              <strong>
                Status:
              </strong>

              <br />

              <select

                value={
                  request.status
                }

                onChange={(e) =>
                  updateStatus(
                    request._id,
                    e.target.value
                  )
                }

                style={{
                  padding:
                    "10px",

                  marginTop:
                    "10px",

                  borderRadius:
                    "8px",

                  border:
                    "1px solid #ccc"
                }}
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

              </select>

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default AdminMaintenance;