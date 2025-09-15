import json
import os
from generate_summary_stats import predict_next_month_quantities

try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    summary_path = os.path.join(current_dir, 'item_summary_stats_updated.json')

    predictions = predict_next_month_quantities(summary_path, forecast_month='2025-04')

    result = [{"item_code": item, "predicted_qty": qty} for item, qty in predictions[:100]]

    # ✅ ONLY THIS should be printed to stdout
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
