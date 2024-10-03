import { useState } from "react";
import { Box, Grid, TextField, Card, styled, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#00A3D9",
}));

const ContentBox = styled("div")(() => ({
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
}));

export default function OTP() {
  const [otp, setOtp] = useState(""); // State untuk menyimpan OTP
  const [error, setError] = useState(false); // State untuk mengecek ada error atau tidak
  const navigate = useNavigate();

  const handleOtpSubmit = () => {
    // Cek OTP, misalnya OTP benar adalah "123456"
    if (otp === "123456") {
      navigate("/session/ResetPassword"); // Jika benar, arahkan ke halaman ResetPassword
    } else {
      setError(true); // Jika salah, tampilkan pesan error
    }
  };

  return (
    <FlexBox>
      <Card>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <ContentBox>
              <h2 style={{ textAlign: "center", color: "#00A3D9", fontSize: "30px", marginBottom: "-1rem" }}>Masukkan OTP</h2>
              <p style={{ textAlign: "center", color: "#70777E", fontSize: "14px", marginBottom: "2rem" }}>
                Masukkan kode OTP yang telah dikirimkan ke email Anda.
              </p>
              <TextField
                fullWidth
                label="OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError(false); // Hilangkan pesan error ketika user mengetik ulang
                }}
                error={error} // Berikan warna merah jika error
                helperText={error ? "OTP salah, coba lagi." : ""} // Tampilkan pesan error di bawah TextField
                sx={{ mb: 0 }}
              />
              <Typography
                variant="body2"
                color="#70777E"
                align="left"
                sx={{ mb: 4 }}
              >
                Belum mendapatkan kode verifikasi?
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => alert('Kirim ulang OTP')}
                >
                  Kirim Ulang
                </Button>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleOtpSubmit}
                sx={{ mb: 4 }}
              >
                Verifikasi OTP
              </Button>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </FlexBox>
  );
}
