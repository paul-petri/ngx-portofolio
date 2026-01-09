# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 17 portfolio management application for Romanian stock market (BET index) trading. It connects to the Tradeville API via WebSocket to fetch and manage stock portfolios, with support for CSV uploads and demo mode.

## Common Commands

### Development
```bash
npm start                 # Start dev server (http://localhost:4200)
ng serve                  # Alternative start command
ng build --watch --configuration development  # Watch mode for development
```

### Building
```bash
ng build                  # Production build (outputs to dist/ngx-portofolio)
```

### Testing
```bash
ng test                   # Run unit tests via Karma
```

### Deployment
```bash
ng deploy --base-href=/ngx-portofolio/  # Deploy to GitHub Pages
```

### Code Generation
```bash
ng generate component component-name    # Generate new component
ng generate service service-name        # Generate new service
```

### Updating BET Index Weights
```bash
./scripts/update-bet-index.sh           # Fetch current BET index composition from BVB
```

To update the BET index weights in `src/app/data/bet20map.ts`:
1. Run the script above to fetch current data from https://m.bvb.ro/
2. Review the output showing all 20 companies and their weights
3. The data is saved to `/tmp/bet_weights_sorted.csv`
4. Manually update `bet20map.ts` with the new weights, or ask Claude to do it
5. Verify the update with the validation test:
   ```bash
   npm test -- --include='**/bet20map.spec.ts' --browsers=ChromeHeadless --watch=false
   ```

**Note**: The BET index is reviewed quarterly (March, June, September, December). Update weights after each quarterly review or when portfolio calculations seem inaccurate.

**Validation**: The test suite (`src/app/data/bet20map.spec.ts`) ensures data integrity by checking that weights sum to ~100%, no stock exceeds 20%, all fields are valid, and the composition matches BVB requirements.

## Architecture

### State Management

The application uses Angular Signals for reactive state management through a centralized `AppStore` service:

- **AppStore** (`src/app/services/app.store.ts`): Central state store managing user authentication, stock data, BET index, and WebSocket connections
  - Uses `signal()` for reactive state with readonly public accessors
  - Handles WebSocket communication with `wss://api.tradeville.ro`
  - Manages login flow (both live and demo mode)
  - Maps CSV imports and API responses to stock portfolio data

### Data Flow

1. **Authentication**: User logs in via `LoginComponent` → `AppStore.setUser()` → WebSocket login message → Portfolio fetch
2. **Portfolio Loading**:
   - Live mode: Fetches from Tradeville API via WebSocket
   - Demo mode: Uses hardcoded data from `src/app/data/mine.ts`
   - CSV import: Parses tab-delimited file via `mapCSVToStocks()`
3. **Stock Processing**: Raw data → matched against BET20 index → enriched with market cap percentages → stored in localStorage via `StorageService`

### Key Components

- **PortofolioComponent** (`src/app/components/portofolio/`): Main portfolio view with chart and detailed table
  - Uses `@swimlane/ngx-charts` for visualization
  - Calculates buy recommendations based on BET index weights vs. current holdings
  - Formula: `toBuy = (betProc - currentProc) * currentValue / currentProc`

- **DetailedViewComponent**: Tabular view of stocks with buy/sell recommendations
- **HeaderComponent**: Navigation and user actions (logout, file upload)
- **UploadModalComponent** & **IndexModalComponent**: Modals for CSV import and index management

### Data Models

- **Stock** (`src/app/models/stock.ts`): Core data type with `symbol`, `name`, `qty`, `value`, `betProc`, `cProc` (current market cap percentage), `toBuy` (rebalancing recommendation)
- **BET20map** (`src/app/data/bet20map.ts`): Reference index mapping stock symbols to names and target weights

### Storage & Persistence

**StorageService** (`src/app/services/storage.service.ts`) manages localStorage:
- User credentials (with demo flag)
- Stock portfolio array
- BET index configuration (can be customized/filtered per user)
- Version management: Auto-updates stored data when `environment.appVersion` changes

### Styling

- **Tailwind CSS** with custom primary color palette and Inter font
- **Angular Material** (indigo-pink theme) for components
- **SCSS** for component-specific styles
- Custom ngx-charts styles in `src/assets/styles/ngx-charts.scss`

### Module Structure

- Uses a hybrid approach: `AppModule` (NgModule) at root with standalone components for features
- `PortofolioComponent`, `DetailedViewComponent`, `HeaderComponent` are standalone
- Routing configured in `AppRoutingModule` with 3 routes: `/login`, `/portofolio`, `/info`

## Important Notes

- The WebSocket connection to `wss://api.tradeville.ro` is established on app init and remains open
- Stock symbols (e.g., TLV, SNP, H2O) are Romanian stock market tickers
- The `proc` field represents the stock's weight in the BET20 index
- Portfolio rebalancing logic assumes negative values for "toBuy" mean sell/reduce position
- CSV import expects tab-delimited format with an "eval" column containing evaluation prices
- Demo mode bypasses authentication and uses static data from `src/app/data/mine.ts`
- The app uses localStorage extensively - clearing it resets all user state
