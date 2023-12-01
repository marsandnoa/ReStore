using API.Data;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext context;
        public BasketController(StoreContext context)
        {
            this.context=context;
        }
        
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();

            return MapBasketToDto(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {

            var basket = await RetrieveBasket();
            if (basket == null) basket=CreateBasket();

            var product = await context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails
            {
                Title = "Product not found",
                Status = 400
            });
            basket.AddItem(product, quantity);

            var result = await context.SaveChangesAsync();
            if (result > 0)
            {
                return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
            }
            else
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Problem adding item to basket",
                    Status = 400,
                });
            }
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity){
            var basket = await RetrieveBasket();
            if(basket==null) return NotFound();

            if(basket.Items.All(item=>item.ProductId!=productId)){
                return BadRequest(new ProblemDetails{
                    Title="Item not found in basket",
                    Status=400
                });
            }else{
                 BasketItem item = basket.Items.FirstOrDefault(item => item.ProductId == productId);
                 if(item.Quantity<=quantity){
                     basket.Items.Remove(item);
                }else{
                    item.Quantity-=quantity;
                }

                var result=await context.SaveChangesAsync();
                if( result>0){
                    return Ok();
                }else{
                    return BadRequest(new ProblemDetails{
                        Title="Problem removing item from basket",
                        Status=400
                    });
                }
            }




        }

        private async Task<Basket> RetrieveBasket()
        {
            return await context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId=Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket
            {
                BuyerId = buyerId
            };
            this.context.Baskets.Add(basket);
            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}