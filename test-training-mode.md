# Training Mode Test Guide

## Overview
This document describes how to test the new @training feature in BentoBoxDS.

## What's Been Implemented

1. **Training Store** (`src/stores/trainingStore.js`)
   - Manages training sessions
   - Logs user actions
   - Saves training data for future fine-tuning

2. **Training Utility** (`src/stores/hopUtility/trainingUtility.js`)
   - Validates training sessions
   - Provides similarity detection
   - Formats data for export

3. **Calendar Tools Integration** (`src/components/bentobox/tools/calendarTools.vue`)
   - Logs date selection actions
   - Tracks different time bundle types (single, range, multi)
   - Records HOP query updates

4. **BeeBee Chat Interface** (`src/components/beebeehelp/inputBox.vue`)
   - @training button to toggle training mode
   - Visual indicators when training is active
   - Session management (start/complete/cancel)

## How to Test

1. **Start Training Mode**:
   - Enter a query in BeeBee chat (e.g., "Show me swimming days in October 2025")
   - Click the @training button
   - You should see a blue banner indicating training mode is active

2. **Perform Actions**:
   - Use the calendar tool to select dates
   - The system will log each action you take
   - The action count will update in the training banner

3. **Complete Training**:
   - Click @training again to complete the session
   - The training data will be logged to console
   - Future: This data will be saved to HOP's besearch store

## Training Data Structure

```json
{
  "id": "1698765432100",
  "peerId": "peer-123",
  "query": "Show me swimming days in October 2025",
  "actions": [
    {
      "component": "CalendarTools",
      "method": "handleDate",
      "args": {
        "date": "2025-10-01",
        "timestamp": 1759276800000
      },
      "timestamp": 1698765435000,
      "order": 0
    },
    {
      "component": "CalendarTools",
      "method": "updateHOPquery",
      "args": {
        "timeBundle": "single",
        "dates": [1759276800000],
        "dateSelection": { "type": "single", "date": "2025-10-01" },
        "bboxid": "bbox-123"
      },
      "result": { "success": true },
      "timestamp": 1698765438000,
      "order": 1
    }
  ],
  "startTime": "2024-10-31T10:30:00Z",
  "endTime": "2024-10-31T10:31:00Z",
  "completed": true
}
```

## Next Steps

1. Add logging to more components (data type selection, computation, visualization)
2. Implement HOP integration for saving training data
3. Create export functionality for training datasets
4. Build peer review system for validating training examples
5. Implement fine-tuning pipeline with collected data