import pandas as pd
import numpy as np
from datetime import datetime
from collections import defaultdict
import json
from sklearn.linear_model import LinearRegression


def generate_summary_stats(input_path='final_output_with_nan.csv', output_path='item_summary_stats.json'):
    # Load data
    df = pd.read_csv(input_path)
    df['YearMonth'] = pd.to_datetime(df['YearMonth'])

    summaries = {}

    for item, group in df.groupby('Item_Code'):
        group = group.sort_values('YearMonth')
        group = group.dropna(subset=['Order_Qty'])

        if len(group) < 6:
            continue  # skip items with insufficient data

        # === Basic Stats ===
        order_qtys = group['Order_Qty'].values
        mean_qty = np.mean(order_qtys)
        std_qty = np.std(order_qtys)

        # === Last 6 months ===
        last_6 = order_qtys[-6:].tolist()

        # === Linear Trend ===
        # X = month index (0,1,2,...), y = order quantity
        X = np.arange(len(group)).reshape(-1, 1)
        y = group['Order_Qty'].values
        model = LinearRegression().fit(X, y)
        slope = model.coef_[0]
        intercept = model.intercept_

        # === Seasonality (avg qty by calendar month) ===
        group['MonthNum'] = group['YearMonth'].dt.month
        seasonality = group.groupby('MonthNum')['Order_Qty'].mean().to_dict()

        # === Save summary ===
        summaries[item] = {
            "mean_qty": round(mean_qty, 2),
            "std_dev_qty": round(std_qty, 2),
            "slope": round(slope, 4),
            "intercept": round(intercept, 2),
            "last_6_months": last_6,
            "seasonality": {str(k): round(v, 2) for k, v in seasonality.items()},
            "last_updated": group['YearMonth'].max().strftime('%Y-%m-%d')
        }

    # Save to JSON
    import json
    with open(output_path, 'w') as f:
        json.dump(summaries, f, indent=2)

    # print(f"Saved summary for {len(summaries)} items → {output_path}")


def update_summary_with_new_month(summary_path, new_data_csv, output_path):
    # Load existing summary
    with open(summary_path, 'r') as f:
        summaries = json.load(f)

    # Load new data
    new_df = pd.read_csv(new_data_csv)
    new_df['YearMonth'] = pd.to_datetime(new_df['YearMonth'])
    new_df['MonthNum'] = new_df['YearMonth'].dt.month

    for _, row in new_df.iterrows():
        item = row['Item_Code']
        qty = row['Order_Qty']
        month = str(row['MonthNum'])  # use str for seasonality dict key
        date_str = row['YearMonth'].strftime('%Y-%m-%d')

        if item not in summaries:
            # print(f"⚠️ Skipping unknown item: {item}")
            continue

        summary = summaries[item]

        # === Update last_6_months ===
        last6 = summary.get('last_6_months', [])
        if len(last6) >= 6:
            last6.pop(0)
        last6.append(qty)
        summary['last_6_months'] = last6

        # === Update mean and std_dev ===
        summary['mean_qty'] = round(np.mean(last6), 2)
        summary['std_dev_qty'] = round(np.std(last6), 2)

        # === Recompute linear trend from last 6 values ===
        if len(last6) >= 2:
            X = np.arange(len(last6)).reshape(-1, 1)
            y = np.array(last6)
            model = LinearRegression().fit(X, y)
            summary['slope'] = round(model.coef_[0], 4)
            summary['intercept'] = round(model.intercept_, 2)

        # === Update seasonality for the current month ===
        seasonality = summary.get('seasonality', {})
        prev = seasonality.get(month, qty)
        updated = (prev + qty) / 2
        seasonality[month] = round(updated, 2)
        summary['seasonality'] = seasonality

        # === Update last_updated ===
        summary['last_updated'] = date_str

    # Save updated summary
    with open(output_path, 'w') as f:
        json.dump(summaries, f, indent=2)

    # print(f"✅ Updated summaries saved to → {output_path}")


def predict_next_month_quantities(summary_path='item_summary_stats_updated.json', forecast_month='2025-04'):
    with open(summary_path, 'r') as f:
        summaries = json.load(f)

    month_num = int(forecast_month.split('-')[1])  # "04" → 4
    predictions = []

    for item, stats in summaries.items():
        last6 = stats.get('last_6_months', [])
        if len(last6) < 2:
            continue

        # Recent average
        recent_avg = np.mean(last6)

        # Linear trend (assume next index = len(last6))
        slope = stats.get('slope', 0)
        intercept = stats.get('intercept', 0)
        trend_estimate = slope * len(last6) + intercept

        # Seasonality adjustment
        seasonality = stats.get('seasonality', {})
        seasonal_factor = seasonality.get(str(month_num), stats['mean_qty'])  # fallback = mean
        seasonal_boost = seasonal_factor - stats['mean_qty']

        # Final forecast
        predicted_qty = trend_estimate + recent_avg + seasonal_boost
        predicted_qty = max(0, round(predicted_qty))  # no negative forecasts

        predictions.append((item, predicted_qty))

    # Sort results by predicted_qty descending
    predictions.sort(key=lambda x: x[1], reverse=True)

    # Print Top N
    # print(f"📦 Forecast for {forecast_month} (Top 100):")
    # print("-" * 40)
    # for item, qty in predictions[:100]:
        # print(f"{item:100s} → {qty}")

    return predictions


# generate_summary_stats("final_output_with_nan2.csv", "item_summary_stats.json")
# update_summary_with_new_month(summary_path='item_summary_stats.json', new_data_csv='orders_march_2025.csv', output_path='item_summary_stats_updated.json')
# predict_next_month_quantities()