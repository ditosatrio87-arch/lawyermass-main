import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { supabase } from "../../../lib/supabase";

export function DocumentVerification() {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    clientName: "",
    type: "Notarial Deed",
    issueDate: new Date().toISOString().split("T")[0],
    status: "Valid",
    files: [],
  });

  // ======================
  // FETCH DATA
  // ======================
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("issueDate", { ascending: false });

    if (!error) setDocuments(data || []);
  };

  // ======================
  // INPUT
  // ======================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ======================
  // FILE UPLOAD (MULTI)
  // ======================
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (let file of files) {
      // Validasi size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} terlalu besar (max 5MB)`);
        continue;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      // Upload
      const { error } = await supabase.storage
        .from("document-files")
        .upload(`documents/${fileName}`, file);

      if (error) {
        console.error(error);
        alert(`Upload gagal: ${file.name}`);
        continue;
      }

      // Ambil URL
      const { data } = supabase.storage
        .from("document-files")
        .getPublicUrl(`documents/${fileName}`);
      if (data && data.publicUrl) {
        uploadedUrls.push(data.publicUrl);
      }
    }

    // Simpan ke state
    setFormData((prev) => ({
      ...prev,
      files: [...(prev.files || []), ...uploadedUrls],
    }));

    if (uploadedUrls.length > 0) {
      alert("Upload selesai");
    }
  };

  // ======================
  // CREATE / UPDATE
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
    };

    let error = null;
    if (editingDoc) {
      const { error: updateError } = await supabase
        .from("documents")
        .update(payload)
        .eq("id", editingDoc.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("documents").insert([payload]);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      alert("Failed to save document: " + error.message);
      return;
    }

    setShowForm(false);
    setEditingDoc(null);
    resetForm();
    fetchDocuments();
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus dokumen ini?")) return;

    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) {
      alert("Failed to delete document: " + error.message);
      return;
    }
    fetchDocuments();
  };
  // ======================
  const handleEdit = (doc) => {
    setFormData({
      ...doc,
      files: doc.files || [],
    });
    setEditingDoc(doc);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      clientName: "",
      type: "Notarial Deed",
      issueDate: new Date().toISOString().split("T")[0],
      status: "Valid",
      files: [],
    });
  };

  // ======================
  // FILTER
  // ======================
  const filteredDocs = documents.filter(
  (doc) =>
    (doc.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.clientName || "").toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Verification</h2>

        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </div>

      {/* FORM */}
      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">

              <input name="code" value={formData.code} onChange={handleInputChange} placeholder="Code" className="w-full border p-2 rounded" />

              {/* Preview files */}
              <div className="flex flex-wrap gap-2">
  {formData.files?.map((file, i) => (
    <a
      key={i}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-pink-100 px-2 py-1 rounded"
                  >
                    File {i + 1}
                  </a>
                ))}
              </div>

              <Button type="submit">
                {loading ? "Saving..." : "Save"}
              </Button>

            </form>
          </CardContent>
        </Card>
      )}

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* TABLE */}
      <Card>
        <CardContent className="p-6">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Client</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Files</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.code}</td>
                  <td>{doc.clientName}</td>
                  <td>
                    {doc.status === "Valid" ? (
                      <CheckCircle className="text-green-500 w-4" />
                    ) : (
                      <XCircle className="text-red-500 w-4" />
                    )}
                  </td>

                  <td>
                    {doc.files?.map((file, i) => (
                      <a key={i} href={file} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 inline mr-1" />
                      </a>
                    ))}
                  </td>

                  <td>
                    <button onClick={() => handleEdit(doc)}>
                      <Edit2 className="w-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 inline text-red-500" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}