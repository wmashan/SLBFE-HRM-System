#!/bin/bash
# ============================================
# JWT Secret Key Generator (Bash)
# ============================================
# Generates a cryptographically secure random
# secret key for JWT token signing
# ============================================

echo ""
echo "========================================"
echo "  JWT Secret Key Generator"
echo "========================================"
echo ""

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "Error: openssl is not installed"
    echo "Please install openssl and try again"
    exit 1
fi

# Generate keys
echo "Generating secret keys..."
echo ""

# 32-character alphanumeric key
key32=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)

# 64-character alphanumeric key
key64=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 64)

# Base64 encoded 32-byte key
keyBase64=$(openssl rand -base64 32 | tr -d '\n')

echo "========================================"
echo "  Generated Keys"
echo "========================================"
echo ""

echo "Option 1: 32-Character Key (Minimum Recommended)"
echo "$key32"
echo ""

echo "Option 2: 64-Character Key (Extra Secure)"
echo "$key64"
echo ""

echo "Option 3: Base64 Encoded 32-Byte Key (Most Secure)"
echo "$keyBase64"
echo ""

echo "========================================"
echo "  SQL Update Commands"
echo "========================================"
echo ""
echo "Execute one of these SQL commands:"
echo ""

echo "-- Using 32-character key:"
echo "UPDATE [dbo].[SystemSettings]"
echo "SET [SettingValue] = '$key32'"
echo "WHERE [SettingKey] = 'JWT_Secret_Key';"
echo ""

echo "-- Using 64-character key:"
echo "UPDATE [dbo].[SystemSettings]"
echo "SET [SettingValue] = '$key64'"
echo "WHERE [SettingKey] = 'JWT_Secret_Key';"
echo ""

echo "-- Using Base64 encoded key (RECOMMENDED):"
echo "UPDATE [dbo].[SystemSettings]"
echo "SET [SettingValue] = '$keyBase64'"
echo "WHERE [SettingKey] = 'JWT_Secret_Key';"
echo ""

echo "========================================"
echo "  Security Reminders"
echo "========================================"
echo ""
echo "✅ Save this key in a secure location"
echo "✅ Update your database immediately"
echo "✅ Never commit this key to source control"
echo "✅ Use Azure Key Vault for production"
echo "✅ Change the key if compromised"
echo "⚠️  Changing the key invalidates all existing tokens"
echo ""

echo "========================================"
echo "  Next Steps"
echo "========================================"
echo ""
echo "1. Copy one of the keys above"
echo "2. Run the corresponding SQL UPDATE command"
echo "3. Verify with: SELECT * FROM SystemSettings WHERE SettingKey = 'JWT_Secret_Key'"
echo "4. Test your login endpoint"
echo ""
