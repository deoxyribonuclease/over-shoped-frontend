import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

const TimedAlert = ({ alertOpen, alertSeverity, alertMessage, handleCloseAlert }) => {
    const [progress, setProgress] = useState(0);
    const autoHideDuration = 6000;

    useEffect(() => {
        if (alertOpen) {
            let timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return Math.min(oldProgress + 100 / (autoHideDuration / 100), 100);
                });
            }, 100);

            return () => {
                clearInterval(timer);
                setProgress(0);
            };
        }
    }, [alertOpen]);

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={alertOpen}
            autoHideDuration={autoHideDuration}
            onClose={handleCloseAlert}
            sx={{
                '& .MuiSnackbarContent-root': {
                    minWidth: '400px',
                    padding: '10px 20px',
                },
            }}
        >
            <Alert
                onClose={handleCloseAlert}
                severity={alertSeverity}
                sx={{
                    width: '100%',
                    fontSize: '1.7rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '15px',
                }}
            >
                {alertMessage}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        width: '100%',
                        marginTop: '5px',
                        height: '2px',
                    }}
                />
            </Alert>
        </Snackbar>
    );
};

export default TimedAlert;
