import { Container, Paper, Typography } from "@mui/material";

export default function ServerError() {
    return (
        <Container component={Paper}>
            <Typography gutterBottom variant="h2">Internal Server Error</Typography>
        </Container>
    )
}