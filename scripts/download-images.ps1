# PowerShell script to download Web3 images

# Create directories if not exist
New-Item -Force -ItemType Directory -Path "public\web3\images\logos" | Out-Null
New-Item -Force -ItemType Directory -Path "public\web3\images\banners" | Out-Null

# Function to download image
function Download-Image {
    param (
        [string]$Url,
        [string]$OutputPath
    )
    
    try {
        Write-Host "Downloading $Url to $OutputPath"
        Invoke-WebRequest -Uri $Url -OutFile $OutputPath
        Write-Host "Success: Downloaded $OutputPath" -ForegroundColor Green
    }
    catch {
        Write-Host "Error downloading $Url : $_" -ForegroundColor Red
    }
}

# Logo images to download
$logos = @(
    @{ id = "uniswap"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/uni.png" },
    @{ id = "pancakeswap"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/cake.png" },
    @{ id = "curve"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/crv.png" },
    @{ id = "sushiswap"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/sushi.png" },
    @{ id = "raydium"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/ray.png" },
    @{ id = "traderjoe"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/joe.png" },
    @{ id = "dydx"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/dydx.png" },
    @{ id = "gmx"; url = "https://assets.coingecko.com/coins/images/18323/large/arbit.png?1631532468" },
    @{ id = "aave"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/aave.png" },
    @{ id = "compound"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/comp.png" },
    @{ id = "makerdao"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/mkr.png" },
    @{ id = "lido"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/ldo.png" },
    @{ id = "alchemix"; url = "https://assets.coingecko.com/coins/images/14113/large/Alchemix.png?1614410406" },
    @{ id = "euler"; url = "https://assets.coingecko.com/coins/images/26149/large/Euler_logo_icon_191121_-_Color.png?1656052749" },
    @{ id = "venus"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/xvs.png" },
    @{ id = "opensea"; url = "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png" },
    @{ id = "blur"; url = "https://pbs.twimg.com/profile_images/1618321556259602433/AiYLhk7Q_400x400.jpg" },
    @{ id = "magiceden"; url = "https://cryptomode.com/wp-content/uploads/2022/01/Magic-Eden-Logo.png" },
    @{ id = "foundation"; url = "https://foundation.app/images/f-icon-touch.png" },
    @{ id = "sudoswap"; url = "https://pbs.twimg.com/profile_images/1543321679656730625/nkUihkUi_400x400.jpg" },
    @{ id = "element"; url = "https://pbs.twimg.com/profile_images/1415579955005927428/qnbS37z8_400x400.jpg" },
    @{ id = "axieinfinity"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/axs.png" },
    @{ id = "sandbox"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/sand.png" },
    @{ id = "stepn"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/gmt.png" },
    @{ id = "illuvium"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/ilv.png" },
    @{ id = "gala"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/gala.png" },
    @{ id = "splinterlands"; url = "https://pbs.twimg.com/profile_images/1455566093146222594/pRpjP--9_400x400.jpg" },
    @{ id = "bigtime"; url = "https://pbs.twimg.com/profile_images/1633952368969162752/bZl879cf_400x400.jpg" },
    @{ id = "metamask"; url = "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" },
    @{ id = "phantom"; url = "https://pbs.twimg.com/profile_images/1394116783831109635/xdMzd-Z1_400x400.jpg" },
    @{ id = "walletconnect"; url = "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.svg" },
    @{ id = "chainlink"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/link.png" },
    @{ id = "thegraph"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/grt.png" },
    @{ id = "generic"; url = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/icon/generic.png" }
)

# Banner images to download
$banners = @(
    @{ id = "default"; url = "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1024" },
    @{ id = "uniswap"; url = "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=1024" },
    @{ id = "pancakeswap"; url = "https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1?q=80&w=1024" },
    @{ id = "curve"; url = "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1024" },
    @{ id = "sushiswap"; url = "https://images.unsplash.com/photo-1617870952348-7524edfb61b7?q=80&w=1024" },
    @{ id = "raydium"; url = "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1024" },
    @{ id = "traderjoe"; url = "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1024" },
    @{ id = "dydx"; url = "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024" },
    @{ id = "gmx"; url = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1024" },
    @{ id = "aave"; url = "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=1024" },
    @{ id = "compound"; url = "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024" },
    @{ id = "makerdao"; url = "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1024" },
    @{ id = "lido"; url = "https://images.unsplash.com/photo-1640340434725-6371f65d4816?q=80&w=1024" },
    @{ id = "alchemix"; url = "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1024" },
    @{ id = "euler"; url = "https://images.unsplash.com/photo-1607893378714-007fd47c8719?q=80&w=1024" },
    @{ id = "venus"; url = "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1024" },
    @{ id = "opensea"; url = "https://images.unsplash.com/photo-1646483236171-8f793d4a9c1a?q=80&w=1024" },
    @{ id = "blur"; url = "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024" },
    @{ id = "magiceden"; url = "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1024" },
    @{ id = "foundation"; url = "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024" },
    @{ id = "sudoswap"; url = "https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=1024" },
    @{ id = "element"; url = "https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=1024" },
    @{ id = "axieinfinity"; url = "https://images.unsplash.com/photo-1640340434808-13793754921e?q=80&w=1024" },
    @{ id = "sandbox"; url = "https://images.unsplash.com/photo-1635321593243-e725415fd876?q=80&w=1024" },
    @{ id = "stepn"; url = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1024" },
    @{ id = "illuvium"; url = "https://images.unsplash.com/photo-1616031037011-83814d0944da?q=80&w=1024" },
    @{ id = "gala"; url = "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1024" },
    @{ id = "splinterlands"; url = "https://images.unsplash.com/photo-1642405748084-5d7c2c06f59d?q=80&w=1024" },
    @{ id = "bigtime"; url = "https://images.unsplash.com/photo-1629117175039-a0a0aea19231?q=80&w=1024" },
    @{ id = "metamask"; url = "https://images.unsplash.com/photo-1620559790086-b92643c2f2e9?q=80&w=1024" },
    @{ id = "phantom"; url = "https://images.unsplash.com/photo-1640340434742-8ab5553be9c9?q=80&w=1024" },
    @{ id = "walletconnect"; url = "https://images.unsplash.com/photo-1642190672018-de09bdf4026b?q=80&w=1024" },
    @{ id = "chainlink"; url = "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1024" },
    @{ id = "thegraph"; url = "https://images.unsplash.com/photo-1642190671868-c14ba7e35156?q=80&w=1024" }
)

# Download logo images
foreach ($logo in $logos) {
    $outputPath = "public\web3\images\logos\$($logo.id).png"
    Download-Image -Url $logo.url -OutputPath $outputPath
}

# Download banner images
foreach ($banner in $banners) {
    $outputPath = "public\web3\images\banners\$($banner.id).jpg"
    Download-Image -Url $banner.url -OutputPath $outputPath
}

Write-Host "All images have been downloaded." -ForegroundColor Cyan 