import { useState, useRef } from "react";
import PageTitle from "../../PageTitle";
import Swal from "sweetalert2";

export default function AddRequest() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subject || !description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }

    setLoading(true);

    // Simulate saving locally (since frontend only)
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Complaint Added",
        text: "Your complaint has been submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setSubject("");
      setDescription("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setLoading(false);
    }, 1500);
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Add Request" />

      <div className="container-fluid" style={{cursor: "default"}}>
        <div className="col-lg-6 mx-auto mt-3"style={{cursor: "default"}} >
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Complaint Details</h5>

              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label">Attachment (optional)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="form-control"
                    onChange={(e) => setAttachment(e.target.files[0])}
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn"
                    style={{ background: "#6776f4", color: "white" }}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
