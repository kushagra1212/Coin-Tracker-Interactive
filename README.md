# Coin-Tracker-Interactive <img align='center' src='https://firebasestorage.googleapis.com/v0/b/eimentum.appspot.com/o/coinTracker%2Fapp%20Icon.png?alt=media&token=7516a8aa-3cb5-440b-9d3b-f6eefd4a9753' width="50">

CoinTracker is a React Native app that allows you to track and monitor various cryptocurrencies. It provides a list of crypto coins along with their volume, price, name, and symbol. You can sort the list based on volume and last price in increasing or decreasing order. The app also utilizes sockets to provide a real-time experience. Additionally, when you click on a coin from the list, an interactive graph with options for day, month, 6 months, year, and all-time data will be displayed.

## Screenshots

Figure 1: Coin List screen displaying the list of crypto coins

<div align="left" style="display: flex; flex-direction: column;">
    <div style="display: flex; justify-content: center; gap: 20px;">
        <img src="https://firebasestorage.googleapis.com/v0/b/eimentum.appspot.com/o/coinTracker%2FWhatsApp%20Image%202023-06-24%20at%202.27.53%20PM.jpeg?alt=media&token=d2b85ba3-9a98-4a7f-8b37-9be2eeed65cb" width="400" alt="Image 1">
        <img src="https://firebasestorage.googleapis.com/v0/b/eimentum.appspot.com/o/coinTracker%2FWhatsApp%20Image%202023-06-24%20at%202.28.03%20PM.jpeg?alt=media&token=88331f0b-bc89-44df-bfcf-1c1ea5f7ee9b" width="400" alt="Image 2">
    </div>
</div>

Figure 2: Graph View screen displaying the interactive graph for a selected coin

## Installation

To run CoinTracker locally on your Android device, follow the steps below:

### Prerequisites

- Node.js (version 12 or above)
- npm or yarn
- Android Studio with Android SDK installed

### Steps

1. Clone the CoinTracker repository:

   ```bash
    git clone https://github.com/kushagra1212/Coin-Tracker-Interactive.git
   ```

2. Navigate to the project directory:

   ```bash
    cd Coin-Tracker-Interactive
   ```

3. Install the project dependencies:

   ```bash
    npm install
   ```

   or

   ```bash
    yarn install
   ```

4. Connect your Android device to your computer using a USB cable, or launch an Android emulator from Android Studio.

5. Build and run the app:

   ```bash
    npx react-native run-android
   ```

   or

   ```bash
    yarn android
   ```

   This will install the app on your device or emulator and launch it.

## Usage

Once the CoinTracker app is running on your Android device, you can perform the following actions:

- View Coin List: The app displays a list of crypto coins along with their volume, price, name, and symbol. By default, the list is sorted by volume in increasing order.
- Sort by Volume: Tap on the "Volume" button at the top of the list to sort the coins based on volume. apping again will toggle between increasing and decreasing order.
  Sort by Last Price: Tap on the "Last Price" button at the top of the list to sort the coins based on last price. Tapping again will toggle between increasing and decreasing order.
- Real-Time Updates: The app utilizes sockets to provide real-time updates. The coin list will automatically refresh whenever there is a change in data.
- Graph View: Click on a coin from the list to view an interactive graph. The graph displays the price history of the selected coin. You can choose different time intervals such as day, month, 6 months, year, or all-time to view the corresponding price trends.

## License

[Proprietary License](https://github.com/kushagra1212/Coin-Tracker-Interactive/blob/main/LICENSE.txt)
