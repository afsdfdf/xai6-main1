# PowerShell script to fix missing images

# IDs that need special mapping
$idMap = @{
  "wallet_connect" = "walletconnect"
  "axieinfinity" = "axs"
  "the_graph" = "thegraph"
  "makerdao" = "maker"
}

# Ensure directories exist
New-Item -Force -ItemType Directory -Path "public\web3\images\logos" | Out-Null
New-Item -Force -ItemType Directory -Path "public\web3\images\banners" | Out-Null

# Get existing files
$existingLogos = (Get-ChildItem "public\web3\images\logos" -File).Name
$existingBanners = (Get-ChildItem "public\web3\images\banners" -File).Name

# Function to get corrected ID
function Get-CorrectedId {
    param (
        [string]$id
    )
    
    # Check for special mappings
    if ($idMap.ContainsKey($id)) {
        return $idMap[$id]
    }
    
    # Replace underscore and lowercase
    return $id.Replace("_", "").ToLower()
}

# List of all app IDs from the app
$appIds = @(
    "uniswap", "pancakeswap", "curve", "sushiswap", "raydium", "traderjoe",
    "dydx", "gmx", "aave", "compound", "makerdao", "lido", "alchemix", "euler", 
    "venus", "opensea", "blur", "magiceden", "foundation", "sudoswap", "element",
    "axieinfinity", "sandbox", "stepn", "illuvium", "gala", "splinterlands", 
    "bigtime", "metamask", "phantom", "wallet_connect", "chainlink", "the_graph"
)

Write-Host "Checking for missing image files..." -ForegroundColor Cyan

# Fix each ID
foreach ($id in $appIds) {
    $correctedId = Get-CorrectedId -id $id
    
    # Logo file
    $logoFile = "${correctedId}.png"
    if (-not ($existingLogos -contains $logoFile)) {
        Write-Host "Creating missing logo: $logoFile for $id" -ForegroundColor Yellow
        Copy-Item -Force "public\web3\images\logos\generic.png" "public\web3\images\logos\$logoFile"
    }
    
    # Banner file
    $bannerFile = "${correctedId}.jpg"
    if (-not ($existingBanners -contains $bannerFile)) {
        Write-Host "Creating missing banner: $bannerFile for $id" -ForegroundColor Yellow
        Copy-Item -Force "public\web3\images\banners\default.jpg" "public\web3\images\banners\$bannerFile"
    }
}

Write-Host "All missing images have been fixed!" -ForegroundColor Green 