const nodemailer = require("nodemailer");

const sendMail = async (order, userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "petshop2024.noreply@gmail.com",
        pass: "phoo ehgl ulck lgef", 
      },
    });

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">
            ${item.name} <span style="color: #888; font-size: 13px;">(x${item.quantity})</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">
            ${item.price.toLocaleString()}đ
          </td>
        </tr>`
      )
      .join("");

    const mailOptions = {
      from: '"Fast Food App 🍔" petshop2024.noreply@gmail.com',
      to: userEmail,
      subject: `Xác nhận đơn hàng #${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          
          <div style="background-color: #FF6B6B; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">Cảm ơn bạn đã đặt hàng!</h2>
            <p style="margin: 5px 0 0; opacity: 0.9;">Đơn hàng đang được xử lý</p>
          </div>

          <div style="padding: 20px;">
            <h3 style="margin-top: 0; color: #333;">Chi tiết đơn hàng</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${itemsHtml}
            </table>

            <div style="text-align: right;">
              <p style="margin: 5px 0;">Phí ship: <strong>${order.shippingFee.toLocaleString()}đ</strong></p>
              <p style="margin: 5px 0;">Giảm giá: <strong style="color: green;">${order.discountAmount.toLocaleString()}đ</strong></p>
              <h3 style="margin: 10px 0 0; color: #d32f2f;">Tổng thanh toán: ${order.price.toLocaleString()}đ</h3>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

            <div>
              <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase;">Giao đến:</p>
              <p style="margin: 5px 0 0; font-weight: bold; color: #333;">${order.deliveryAddress}</p>
            </div>
          </div>

          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Cảm ơn bạn đã tin tưởng Fast Food App!</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendMail };