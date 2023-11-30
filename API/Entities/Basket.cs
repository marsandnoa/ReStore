namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        public List<BasketItem> Items{ get; set; }= new List<BasketItem>();

        public void AddItem(Product product, int quantity)
        {
            if(Items.All(item=>item.ProductId!=product.Id)){
                Items.Add(new BasketItem{
                    Product=product,
                    Quantity=quantity
                });
            }else{

                var existingItem=Items.FirstOrDefault(item=>item.ProductId==product.Id);
                if(existingItem!=null){
                    existingItem.Quantity+=quantity;
                }
            }
        }

        public void RemoveItem(int ProductId, int quantity)
        {
            var existingItem=Items.FirstOrDefault(item=>item.ProductId==ProductId);
            if(existingItem!=null){
                existingItem.Quantity-=quantity;
                if(existingItem.Quantity<=0){
                    Items.Remove(existingItem);
                }
            }else{
                return;
            }
        }

    }
}