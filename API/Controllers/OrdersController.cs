using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext context;
        public OrdersController(StoreContext context)
        {
            this.context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders(){
            return await context.Orders
            .ProjectOrderToOrderDto()
            .Where(x=>x.BuyerId==User.Identity.Name)
            .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id){
            return await context.Orders
            .ProjectOrderToOrderDto()
            .Where(x=>x.BuyerId==User.Identity.Name&&x.Id==id)
            .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket=await context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if(basket==null) return BadRequest(new ProblemDetails{Title="Basket not found"});
            
            var items=new List<OrderItem>();

            foreach(var item in basket.Items){
                var productItem=await context.Products.FindAsync(item.ProductId);
                var itemOrdered=new ProductItemOrder
                {
                    ProductId=productItem.Id,
                    Name=productItem.Name,
                    PictureUrl=productItem.PictureUrl
                };

                var orderItem=new OrderItem
                {
                    ItemOrdered=itemOrdered,
                    Price=productItem.Price,
                    Quantity=item.Quantity
                };

                items.Add(orderItem);
                productItem.QuantityInStock-=item.Quantity;
            }
            var subtotal=items.Sum(item=>item.Price*item.Quantity);
            var deliveryFee=subtotal>100000?0:500;

            var order=new Order{
                OrderItems=items,
                BuyerId=User.Identity.Name,
                ShippingAddress=orderDto.ShippingAddress,
                Subtotal=subtotal,
                DeliveryFee=deliveryFee,
                OrderDate=DateTime.Now,
            };

            context.Orders.Add(order);
            context.Baskets.Remove(basket);

            if(orderDto.SaveAddress){
                var user=context.Users
                .Include(a=>a.Address)
                .FirstOrDefault(x=>x.UserName==User.Identity.Name);

                var address=new UserAddress{
                    FullName=orderDto.ShippingAddress.FullName,
                    Address1=orderDto.ShippingAddress.Address1,
                    Address2=orderDto.ShippingAddress.Address2,
                    City=orderDto.ShippingAddress.City,
                    State=orderDto.ShippingAddress.State,
                    ZipCode=orderDto.ShippingAddress.ZipCode,
                    Country=orderDto.ShippingAddress.Country
                };

                user.Address=address;

                context.Update(user);
            }

            var result=await context.SaveChangesAsync()>0;

            if (result) return Ok(new { orderId = order.Id});

            return BadRequest(new ProblemDetails{Title="Problem creating order"});
        }    
    }


}