<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Table(name: 'product')]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id_product', type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column(name: 'is_available', type: 'boolean')]
    private ?bool $isAvailable = null;

    #[ORM\Column(name: 'display_order', type: 'integer')]
    private ?int $displayOrder = null;

    #[ORM\Column(name: 'is_featured', type: 'boolean')]
    private ?bool $isFeatured = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(
        name: 'id_category',
        referencedColumnName: 'id_category',
        nullable: false,
        onDelete: 'RESTRICT'
    )]
    private ?Category $category = null;

    /**
     * @var Collection<int, FoodCharacteristic>
     */
    #[ORM\ManyToMany(
        targetEntity: FoodCharacteristic::class,
        inversedBy: 'products'
    )]
    #[ORM\JoinTable(name: 'product_food_characteristic')]
    #[ORM\JoinColumn(
        name: 'id_product',
        referencedColumnName: 'id_product',
        onDelete: 'CASCADE'
    )]
    #[ORM\InverseJoinColumn(
        name: 'id_food_characteristic',
        referencedColumnName: 'id_food_characteristic',
        onDelete: 'CASCADE'
    )]
    private Collection $foodCharacteristics;

    public function __construct()
    {
        $this->foodCharacteristics = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function isAvailable(): ?bool
    {
        return $this->isAvailable;
    }

    public function setIsAvailable(bool $isAvailable): static
    {
        $this->isAvailable = $isAvailable;

        return $this;
    }

    public function getDisplayOrder(): ?int
    {
        return $this->displayOrder;
    }

    public function setDisplayOrder(int $displayOrder): static
    {
        $this->displayOrder = $displayOrder;

        return $this;
    }

    public function isFeatured(): ?bool
    {
        return $this->isFeatured;
    }

    public function setIsFeatured(bool $isFeatured): static
    {
        $this->isFeatured = $isFeatured;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, FoodCharacteristic>
     */
    public function getFoodCharacteristics(): Collection
    {
        return $this->foodCharacteristics;
    }

    public function addFoodCharacteristic(
        FoodCharacteristic $foodCharacteristic
    ): static {
        if (!$this->foodCharacteristics->contains($foodCharacteristic)) {
            $this->foodCharacteristics->add($foodCharacteristic);
            $foodCharacteristic->addProduct($this);
        }

        return $this;
    }

    public function removeFoodCharacteristic(
        FoodCharacteristic $foodCharacteristic
    ): static {
        if ($this->foodCharacteristics->removeElement($foodCharacteristic)) {
            $foodCharacteristic->removeProduct($this);
        }

        return $this;
    }
}
