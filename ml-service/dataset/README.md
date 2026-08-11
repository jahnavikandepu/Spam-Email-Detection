# SpamGuard Dataset Directory

Place your spam email training dataset in this folder.

### Expected File Path:
`dataset/spam_dataset.csv`

### Expected CSV Format:
The dataset must contain two main columns: `text` and `label`.

```csv
text,label
"Congratulations! You won a $1,000 gift card! Click here.",spam
"Hi Alex, can we review the project slides tomorrow at 10 AM?",not_spam
"Urgent: Account access restricted. Verify your password now.",spam
"Please find attached the updated monthly documentation report.",not_spam
```

### Next Step:
Once `spam_dataset.csv` is added to this folder, run the training script from the `ml-service` directory:

```bash
python train.py
```
