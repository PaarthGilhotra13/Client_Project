// final
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiServices from "../../../ApiServices";

const STEPS = ["Pending", "Approved", "Rejected"];

// 🎨 Status based colors
const STATUS_COLORS = {
  Pending: "#facc15",   // yellow
  Approved: "#22c55e",  // green
  Rejected: "#ef4444",  // red
};

export default function TrackExpenses() {
  const { id } = useParams(); // _id aa rahi hai
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    ApiServices.GetSingleExpense({ _id: id })
      .then((res) => {
        const result = res?.data?.data;

        if (Array.isArray(result)) {
          setData(result[0] || null);
        } else {
          setData(result || null);
        }

        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [id]);

  if (!id) return null;

  // ✅ SAFE currentStatus handling
  const status = data?.currentStatus?.toString()?.trim() || "Pending";
  const activeIndex = STEPS.indexOf(status);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          width: "420px",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between mb-3">
          <h6 className="mb-0">Track Expense</h6>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => navigate(-1)}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {loading && <p>Loading...</p>}

        {!loading && !data && (
          <p className="text-danger">
            No data found for this expense.
          </p>
        )}

        {!loading && data && (
          <>
            <p><b>Ticket ID:</b> {data.ticketId}</p>
            <p><b>Store:</b> {data.storeId?.storeName}</p>
            <p><b>Expense:</b> {data.expenseHeadId?.name}</p>
            <p><b>Amount:</b> ₹ {data.amount}</p>
            <p>
              <b>Date:</b>{" "}
              {new Date(data.createdAt).toLocaleDateString()}
            </p>

            {/* STATUS TIMELINE */}
            <div className="mt-3">
              {STEPS.map((step, index) => {
                const completed = index < activeIndex;
                const active = index === activeIndex;

                const color =
                  active || completed
                    ? STATUS_COLORS[step]
                    : "#d1d5db";

                return (
                  <div key={step} style={{ display: "flex", gap: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: color,
                        }}
                      />
                      {index !== STEPS.length - 1 && (
                        <div
                          style={{
                            width: 2,
                            height: 30,
                            background: completed ? color : "#d1d5db",
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        fontWeight: active ? 600 : 400,
                        color: active ? "#000" : "#9ca3af",
                      }}
                    >
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

