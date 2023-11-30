import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage(){
    const [validationErrors,setValidationErrors] = useState<string[]>([])

    function getValidationError(){
        agent.TestErrors.getValidationError()
        .then(()=> console.log("should not see this"))
        .catch(error => setValidationErrors(error));
    }
    return(
        <Container>
            <Typography gutterBottom variant="h2">Errors</Typography>
            <ButtonGroup fullWidth>
                <Button variant='contained' onClick={() => agent.TestErrors.get400().catch(error=> console.log(error))}>400</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get401().catch(error=> console.log(error))}>401</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get404().catch(error=> console.log(error))}>404</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get500().catch(error=> console.log(error))}>500</Button>
                <Button variant='contained' onClick={getValidationError}>Validation Error</Button>
            </ButtonGroup>
            {validationErrors.length > 0 &&
                <Alert severity='error'>
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map((error, i)=>(
                            <ListItem key={i}>{error}</ListItem>
                        ))}
                    </List>
                </Alert>
            }
        </Container>
    )
}