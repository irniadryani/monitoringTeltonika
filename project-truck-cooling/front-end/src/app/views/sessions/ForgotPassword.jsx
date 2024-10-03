import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Grid, styled, TextField } from "@mui/material";

const StyledRoot = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#00A3D9",
  minHeight: "100vh",
  padding: "1rem",

  "& .card": {
    maxWidth: 800,
    height: "auto",
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  ".img-wrapper": {
    width: "100%",
    textAlign: "center",
    marginTop: "-3rem",
    marginBottom: "2rem",
    position: "relative", // Atur relative untuk parent agar teks di atas gambar bisa diposisikan
  },

  ".text-overlay": {
    position: "absolute", // Teks ditempatkan di atas gambar
    marginTop: "-2rem", // Atur posisi sesuai kebutuhan
    left: "50%",
    transform: "translate(-50%, -50%)", // Untuk memastikan teks terpusat
    color: "#00A3D9", // Warna teks (hitam)
    fontSize: "30px", // Ukuran font
    fontWeight: "bold", // Ketebalan font
    zIndex: 1, // Pastikan teks berada di atas gambar
  },

  ".small-text": {
    marginBottom: "-2rem",
    marginTop: "-0.5rem", // Jarak antara teks utama dan teks kecil
    color: "#70777E", // Warna teks kecil
    fontSize: "14px", // Ukuran font kecil
  }
}));

const ContentBox = styled("div")(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default
}));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");

  const handleFormSubmit = () => {
    console.log(email);
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <div className="img-wrapper">
              {/* Gambar */}
              <img width="80%" src="/assets/images/illustrations/truck.svg" alt="Truck Cooling" />
              {/* Teks di atas gambar */}
              <div className="text-overlay">Lupa Password?</div>
              {/* Teks kecil di bawah teks utama */}
              <div className="small-text">Masukkan email yang terhubung dengan akun Anda</div>
            </div>

            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label="Email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3, width: "100%" }}
                />

                <Button fullWidth variant="contained" color="primary" type="submit">
                  Reset Password
                </Button>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mt: 2 }}>
                  Go Back
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}
