Add-Type -AssemblyName System.Drawing

function Draw-BlockzuIcon {
    param (
        [int]$size,
        [string]$outputPath,
        [bool]$isForeground = $false,
        [bool]$isRound = $false
    )

    $bitmap = New-Object System.Drawing.Bitmap $size, $size
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if (-not $isForeground) {
        # Background: Rich Deep Navy Gradient
        $bgRect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
        $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            (New-Object System.Drawing.Point 0, 0),
            (New-Object System.Drawing.Point $size, $size),
            [System.Drawing.ColorTranslator]::FromHtml("#1E3A8A"),
            [System.Drawing.ColorTranslator]::FromHtml("#070A14")
        )
        if ($isRound) {
            $path = New-Object System.Drawing.Drawing2D.GraphicsPath
            $path.AddEllipse(0, 0, $size, $size)
            $graphics.FillPath($bgBrush, $path)
        } else {
            $graphics.FillRectangle($bgBrush, $bgRect)
        }
        $bgBrush.Dispose()
    } else {
        $graphics.Clear([System.Drawing.Color]::Transparent)
    }

    # Center area for 2x2 blocks
    $scale = if ($isForeground) { 0.62 } else { 0.74 }
    $areaSize = $size * $scale
    $offsetX = ($size - $areaSize) / 2
    $offsetY = ($size - $areaSize) / 2

    $blockSize = $areaSize * 0.45
    $gap = $areaSize * 0.10
    $blockRadius = [Math]::Max(4, [int]($blockSize * 0.22))

    # Helper for rounded rectangles
    function Add-RoundedRect([System.Drawing.Drawing2D.GraphicsPath]$p, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
        $d = $r * 2
        $p.AddArc($x, $y, $d, $d, 180, 90)
        $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
        $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
        $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
        $p.CloseFigure()
    }

    $blocks = @(
        @{ X = $offsetX; Y = $offsetY; C1 = "#38BDF8"; C2 = "#0284C7" }, # Cyan Top-Left
        @{ X = $offsetX + $blockSize + $gap; Y = $offsetY; C1 = "#FDE047"; C2 = "#D97706" }, # Gold Top-Right
        @{ X = $offsetX; Y = $offsetY + $blockSize + $gap; C1 = "#C084FC"; C2 = "#7C3AED" }, # Violet Bottom-Left
        @{ X = $offsetX + $blockSize + $gap; Y = $offsetY + $blockSize + $gap; C1 = "#FB7185"; C2 = "#E11D48" } # Rose Bottom-Right
    )

    foreach ($b in $blocks) {
        # Drop shadow
        $shadowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        Add-RoundedRect $shadowPath ($b.X) ($b.Y + [Math]::Max(2, $size * 0.015)) $blockSize $blockSize $blockRadius
        $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(90, 0, 0, 0))
        $graphics.FillPath($shadowBrush, $shadowPath)
        $shadowPath.Dispose()
        $shadowBrush.Dispose()

        # Block body gradient
        $blockPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        Add-RoundedRect $blockPath ($b.X) ($b.Y) $blockSize $blockSize $blockRadius
        $bBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            (New-Object System.Drawing.PointF $b.X, $b.Y),
            (New-Object System.Drawing.PointF ($b.X + $blockSize), ($b.Y + $blockSize)),
            [System.Drawing.ColorTranslator]::FromHtml($b.C1),
            [System.Drawing.ColorTranslator]::FromHtml($b.C2)
        )
        $graphics.FillPath($bBrush, $blockPath)

        # Subtle crisp outline
        $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(140, 255, 255, 255)), ([Math]::Max(1.5, $size * 0.012))
        $graphics.DrawPath($pen, $blockPath)
        $pen.Dispose()

        # Gloss reflection highlight
        $glossBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(160, 255, 255, 255))
        $glossRadius = [Math]::Max(2, $blockSize * 0.22)
        $graphics.FillEllipse($glossBrush, ($b.X + $blockSize * 0.22), ($b.Y + $blockSize * 0.18), $glossRadius, $glossRadius)
        $glossBrush.Dispose()

        $blockPath.Dispose()
        $bBrush.Dispose()
    }

    $outDir = Split-Path -Parent $outputPath
    if (-not (Test-Path $outDir)) {
        New-Item -ItemType Directory -Path $outDir -Force | Out-Null
    }

    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Generated: $outputPath ($size x $size)"
}

# 1. Android Mipmap Icons
$resDir = "c:\Users\Utkarsh Pal\Documents\blockzu\android\app\src\main\res"

$densities = @(
    @{ Name = "mipmap-mdpi"; Size = 48; ForeSize = 108 },
    @{ Name = "mipmap-hdpi"; Size = 72; ForeSize = 162 },
    @{ Name = "mipmap-xhdpi"; Size = 96; ForeSize = 216 },
    @{ Name = "mipmap-xxhdpi"; Size = 144; ForeSize = 324 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192; ForeSize = 432 }
)

foreach ($d in $densities) {
    $dir = Join-Path $resDir $d.Name
    Draw-BlockzuIcon -size $d.Size -outputPath (Join-Path $dir "ic_launcher.png") -isForeground $false -isRound $false
    Draw-BlockzuIcon -size $d.Size -outputPath (Join-Path $dir "ic_launcher_round.png") -isForeground $false -isRound $true
    Draw-BlockzuIcon -size $d.ForeSize -outputPath (Join-Path $dir "ic_launcher_foreground.png") -isForeground $true -isRound $false
}

# 2. Store Icons & Web Icons
$storeDir = "c:\Users\Utkarsh Pal\Documents\blockzu\assets\store\icon"
Draw-BlockzuIcon -size 512 -outputPath (Join-Path $storeDir "icon-512.png") -isForeground $false -isRound $false
Draw-BlockzuIcon -size 1024 -outputPath (Join-Path $storeDir "icon-1024.png") -isForeground $false -isRound $false
Draw-BlockzuIcon -size 512 -outputPath "c:\Users\Utkarsh Pal\Documents\blockzu\public\favicon.png" -isForeground $false -isRound $false
Draw-BlockzuIcon -size 512 -outputPath "c:\Users\Utkarsh Pal\Documents\blockzu\public\assets\store\icon\icon-512.png" -isForeground $false -isRound $false
