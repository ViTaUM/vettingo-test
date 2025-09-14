# 🔧 Endpoints Faltantes - API de Pagamento

## 📋 Resumo
Estes endpoints são necessários para completar a integração de pagamentos e eliminar completamente o uso direto do Stripe no frontend.

---

## 💳 **PAGAMENTOS ÚNICOS**

### 1. Criar PaymentIntent
**POST** `/payments/create-intent`

Cria um PaymentIntent para pagamentos únicos (sem assinatura).

#### Request Body
```json
{
  "amount": 1000,
  "currency": "brl",
  "description": "Pagamento único",
  "metadata": {
    "orderId": "123",
    "customerName": "João Silva"
  }
}
```

#### Response (200)
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentIntentId": "pi_xxx",
  "amount": 1000,
  "currency": "brl"
}
```

#### Response (400) - Erro de validação
```json
{
  "success": false,
  "error": "Valor deve ser maior que zero",
  "statusCode": 400
}
```

#### Response (500) - Erro do Stripe
```json
{
  "success": false,
  "error": "Erro ao criar PaymentIntent",
  "statusCode": 500
}
```

---

## 🔐 **MÉTODOS DE PAGAMENTO**

### 2. Criar SetupIntent
**POST** `/payment-methods/create-setup-intent`

Cria um SetupIntent para adicionar métodos de pagamento sem fazer cobrança.

#### Request Body
```json
{
  "metadata": {
    "cardholderName": "João Silva",
    "cardType": "credit",
    "userId": "123"
  }
}
```

#### Response (200)
```json
{
  "success": true,
  "clientSecret": "seti_xxx_secret_yyy",
  "setupIntentId": "seti_xxx"
}
```

#### Response (500) - Erro do Stripe
```json
{
  "success": false,
  "error": "Erro ao criar SetupIntent",
  "statusCode": 500
}
```

### 3. Validar Cartão
**POST** `/payment-methods/validate-card`

Valida dados do cartão antes de salvar (sem criar PaymentMethod).

#### Request Body
```json
{
  "cardNumber": "4242424242424242",
  "expMonth": 12,
  "expYear": 2025,
  "cvc": "123"
}
```

#### Response (200) - Cartão válido
```json
{
  "success": true,
  "valid": true,
  "brand": "visa",
  "last4": "4242",
  "expMonth": 12,
  "expYear": 2025,
  "country": "US"
}
```

#### Response (200) - Cartão inválido
```json
{
  "success": true,
  "valid": false,
  "error": "Número do cartão inválido",
  "errorCode": "invalid_number"
}
```

#### Response (400) - Dados malformados
```json
{
  "success": false,
  "error": "Dados do cartão incompletos",
  "statusCode": 400
}
```

---

## ✅ **CONFIRMAÇÃO DE PAGAMENTOS**

### 4. Confirmar Pagamento
**POST** `/payments/confirm`

Confirma um pagamento após a criação do PaymentIntent.

#### Request Body
```json
{
  "paymentIntentId": "pi_xxx",
  "paymentMethodId": "pm_xxx"
}
```

#### Response (200) - Pagamento confirmado
```json
{
  "success": true,
  "status": "succeeded",
  "paymentId": 123,
  "amount": 1000,
  "currency": "brl",
  "paidAt": "2024-01-01T00:00:00.000Z"
}
```

#### Response (200) - Pagamento requer ação
```json
{
  "success": true,
  "status": "requires_action",
  "requiresAction": true,
  "nextAction": {
    "type": "use_stripe_sdk",
    "useStripeSdk": {
      "type": "three_d_secure_redirect",
      "stripeJs": "https://js.stripe.com/v3/",
      "stripeAccount": "acct_xxx"
    }
  }
}
```

#### Response (400) - Erro de confirmação
```json
{
  "success": false,
  "error": "PaymentIntent não encontrado",
  "statusCode": 400
}
```

---

## 🔄 **WEBHOOKS ADICIONAIS**

### 5. Webhook de Confirmação
**POST** `/webhooks/payment-confirmation`

Endpoint para confirmar pagamentos via webhook (alternativo ao frontend).

#### Request Body
```json
{
  "paymentIntentId": "pi_xxx",
  "status": "succeeded",
  "metadata": {
    "orderId": "123",
    "userId": "456"
  }
}
```

#### Response (200)
```json
{
  "success": true,
  "paymentId": 123,
  "status": "confirmed"
}
```

---

## 📊 **TIPOS E ENUMS**

### Status de Pagamento
```typescript
enum PaymentIntentStatus {
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  REQUIRES_ACTION = 'requires_action',
  PROCESSING = 'processing',
  REQUIRES_CAPTURE = 'requires_capture',
  CANCELED = 'canceled',
  SUCCEEDED = 'succeeded'
}
```

### Tipos de Cartão
```typescript
enum CardBrand {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  DISCOVER = 'discover',
  DINERS_CLUB = 'diners_club',
  JCB = 'jcb',
  UNIONPAY = 'unionpay'
}
```

### Códigos de Erro
```typescript
enum PaymentErrorCode {
  INVALID_NUMBER = 'invalid_number',
  INVALID_EXPIRY_MONTH = 'invalid_expiry_month',
  INVALID_EXPIRY_YEAR = 'invalid_expiry_year',
  INVALID_CVC = 'invalid_cvc',
  INCORRECT_NUMBER = 'incorrect_number',
  EXPIRED_CARD = 'expired_card',
  INCORRECT_CVC = 'incorrect_cvc',
  INCORRECT_ZIP = 'incorrect_zip',
  CARD_DECLINED = 'card_declined',
  MISSING = 'missing',
  PROCESSING_ERROR = 'processing_error'
}
```

---

## 🔄 **FLUXO DE INTEGRAÇÃO**

### 1. **Pagamento Único**
```javascript
// 1. Criar PaymentIntent
const intent = await fetch('/payments/create-intent', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    amount: 1000,
    currency: 'brl',
    description: 'Pagamento único'
  })
});

// 2. Usar clientSecret no frontend (Stripe Elements)
// 3. Confirmar pagamento
const confirmation = await fetch('/payments/confirm', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    paymentIntentId: intent.paymentIntentId,
    paymentMethodId: 'pm_xxx'
  })
});
```

### 2. **Adicionar Método de Pagamento**
```javascript
// 1. Criar SetupIntent
const setup = await fetch('/payment-methods/create-setup-intent', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    metadata: { cardholderName: 'João Silva' }
  })
});

// 2. Usar clientSecret no frontend (Stripe Elements)
// 3. Salvar método de pagamento
const paymentMethod = await fetch('/payment-methods', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    stripePaymentMethodId: 'pm_xxx',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  })
});
```

### 3. **Validar Cartão**
```javascript
// Validar antes de salvar
const validation = await fetch('/payment-methods/validate-card', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    cardNumber: '4242424242424242',
    expMonth: 12,
    expYear: 2025,
    cvc: '123'
  })
});

if (validation.valid) {
  // Proceder com salvamento
}
```

---

## 🚨 **CÓDIGOS DE ERRO ESPECÍFICOS**

### 400 - Bad Request
```json
{
  "success": false,
  "error": "Dados inválidos",
  "statusCode": 400,
  "details": {
    "amount": "Valor deve ser maior que zero",
    "currency": "Moeda não suportada"
  }
}
```

### 402 - Payment Required
```json
{
  "success": false,
  "error": "Pagamento recusado",
  "statusCode": 402,
  "stripeError": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Seu cartão foi recusado"
  }
}
```

### 409 - Conflict
```json
{
  "success": false,
  "error": "PaymentIntent já foi confirmado",
  "statusCode": 409
}
```

### 422 - Unprocessable Entity
```json
{
  "success": false,
  "error": "Dados do cartão inválidos",
  "statusCode": 422,
  "validationErrors": {
    "cardNumber": "Número inválido",
    "expMonth": "Mês inválido"
  }
}
```

---

## 📝 **NOTAS DE IMPLEMENTAÇÃO**

1. **Segurança**: Todos os endpoints requerem autenticação JWT
2. **Validação**: Validar dados antes de enviar para o Stripe
3. **Logs**: Registrar todas as operações para auditoria
4. **Rate Limiting**: Implementar rate limiting para evitar abuso
5. **Webhooks**: Configurar webhooks do Stripe para sincronização
6. **Testes**: Usar cartões de teste do Stripe para desenvolvimento

---

**🎯 Com estes endpoints, o frontend pode eliminar completamente o uso direto do Stripe!**
