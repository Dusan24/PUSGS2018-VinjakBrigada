namespace RentApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class implementedinitialmodel1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AppUsers", "Birthday", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AppUsers", "Birthday", c => c.DateTime(nullable: false));
        }
    }
}